create table if not exists public.chat_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_logs enable row level security;

create policy "Users can insert their own chat logs"
  on public.chat_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own chat logs"
  on public.chat_logs for select
  using (auth.uid() = user_id);
