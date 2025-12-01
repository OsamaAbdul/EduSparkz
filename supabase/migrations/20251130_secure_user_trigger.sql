-- Secure the handle_new_user function to prevent arbitrary role assignment via metadata
-- Previously, this function allowed a user to set their own role by passing it in metadata, which is a security vulnerability.
-- This update forces the role to be 'user' for all new signups. Admin promotion must be done securely (e.g. via database access or a secure edge function).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Always default to 'user', ignore client-provided role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
