-- 1. Explicitly point class_enrollments.user_id to public.profiles(id)
-- This allows Supabase (PostgREST) to automatically detect the relationship for nested joins like `class_enrollments(profiles(*))`.

ALTER TABLE public.class_enrollments
DROP CONSTRAINT IF EXISTS class_enrollments_user_id_fkey;

ALTER TABLE public.class_enrollments
ADD CONSTRAINT class_enrollments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Add email column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 3. Backfill email from auth.users
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND public.profiles.email IS NULL;

-- 4. Update the handle_new_user trigger to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user', -- Always default to 'user', ignore client-provided role
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
