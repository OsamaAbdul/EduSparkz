-- Add unique_id to profiles for student logins
alter table profiles add column if not exists unique_id text unique;

-- Generate unique IDs for existing users if needed
update profiles set unique_id = 'STU-' || upper(substring(id::text, 1, 8)) where unique_id is null;
