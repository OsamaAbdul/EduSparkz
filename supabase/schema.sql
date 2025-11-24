
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Quizzes Table
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  questions jsonb not null, -- Stores the array of questions
  source_text text,
  difficulty text default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table quizzes enable row level security;

create policy "Users can view their own quizzes."
  on quizzes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own quizzes."
  on quizzes for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own quizzes."
  on quizzes for delete
  using ( auth.uid() = user_id );

-- Quiz Results Table
create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  score integer not null,
  total integer not null,
  duration integer not null, -- in seconds
  level text,
  motivational_message text,
  results jsonb not null, -- Detailed results
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table quiz_results enable row level security;

create policy "Users can view their own quiz results."
  on quiz_results for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own quiz results."
  on quiz_results for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own quiz results."
  on quiz_results for delete
  using ( auth.uid() = user_id );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Leaderboard Function
create or replace function get_leaderboard(limit_count int)
returns table (
  username text,
  "totalQuizzes" bigint,
  "averageScorePercentage" numeric,
  "averageDuration" numeric,
  "highestLevel" text,
  rank bigint
)
language plpgsql
as $$
begin
  return query
  with user_stats as (
    select
      p.username,
      count(qr.id) as total_quizzes,
      avg(qr.score::numeric / qr.total * 100) as avg_score_percentage,
      avg(qr.duration) as avg_duration,
      -- Logic for highest level (simplified)
      max(qr.level) as highest_level
    from quiz_results qr
    join profiles p on qr.user_id = p.id
    group by p.username
  )
  select
    us.username,
    us.total_quizzes as "totalQuizzes",
    round(us.avg_score_percentage, 2) as "averageScorePercentage",
    round(us.avg_duration, 2) as "averageDuration",
    us.highest_level as "highestLevel",
    rank() over (order by us.avg_score_percentage desc, us.total_quizzes desc) as rank
  from user_stats us
  limit limit_count;
end;
$$;

-- Retention Algorithm Function
create or replace function get_retention_questions(p_user_id uuid)
returns table (
  question text,
  "optionA" text,
  "optionB" text,
  "optionC" text,
  "optionD" text,
  "correctAnswer" text,
  "correctAnswerText" text,
  explanation text,
  quiz_id uuid,
  quiz_title text
)
language plpgsql
as $$
begin
  return query
  with latest_results as (
    select distinct on (qr.quiz_id)
      qr.quiz_id,
      qr.score,
      qr.total,
      qr.submitted_at,
      q.title,
      q.questions
    from quiz_results qr
    join quizzes q on qr.quiz_id = q.id
    where qr.user_id = p_user_id
    order by qr.quiz_id, qr.submitted_at desc
  ),
  failed_quizzes as (
    select *
    from latest_results
    where (score::numeric / total) < 0.7 -- Threshold for failure (70%)
  ),
  expanded_questions as (
    select
      fq.quiz_id,
      fq.title as quiz_title,
      jsonb_array_elements(fq.questions) as question_data
    from failed_quizzes fq
  )
  select
    (question_data->>'question')::text,
    (question_data->>'optionA')::text,
    (question_data->>'optionB')::text,
    (question_data->>'optionC')::text,
    (question_data->>'optionD')::text,
    (question_data->>'correctAnswer')::text,
    (question_data->>'correctAnswerText')::text,
    (question_data->>'explanation')::text,
    eq.quiz_id,
    eq.quiz_title
  from expanded_questions eq
  order by random()
  limit 2; -- Return 2 random questions from failed quizzes
end;
$$;

-- Materials Table (for storing uploaded/extracted content)
create table materials (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text, -- Extracted text content
  file_type text, -- e.g., 'pdf', 'docx', 'txt'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table materials enable row level security;

create policy "Users can view their own materials."
  on materials for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own materials."
  on materials for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own materials."
  on materials for delete
  using ( auth.uid() = user_id );

create policy "Users can update their own materials."
  on materials for update
  using ( auth.uid() = user_id );



-- Add onboarding fields to profiles
alter table profiles add column if not exists onboarding_completed boolean default false;
alter table profiles add column if not exists learning_goals text[];
alter table profiles add column if not exists learning_style text;

-- Learning Paths Table
create table if not exists learning_paths (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  modules jsonb, -- Array of steps/modules e.g. [{title: "Basics", status: "pending", content: "..."}]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table learning_paths enable row level security;

create policy "Users can view their own learning paths."
  on learning_paths for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own learning paths."
  on learning_paths for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own learning paths."
  on learning_paths for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own learning paths."
  on learning_paths for delete
  using ( auth.uid() = user_id );

-- Notifications Table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table notifications enable row level security;

create policy "Users can view their own notifications."
  on notifications for select
  using ( auth.uid() = user_id );

create policy "Users can update their own notifications."
  on notifications for update
  using ( auth.uid() = user_id );

create policy "Users can insert their own notifications." -- For system triggers or client-side logic if needed
  on notifications for insert
  with check ( auth.uid() = user_id );

-- Add plan column to profiles
alter table profiles add column if not exists plan text default 'Free';

