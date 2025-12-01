-- Drop existing trigger and function to ensure clean update
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with robust error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  referrer_id UUID;
  given_referral_code TEXT;
  generated_code TEXT;
  final_username TEXT;
  base_username TEXT;
  counter INT := 0;
BEGIN
  -- Extract referral code from metadata if provided
  given_referral_code := NULLIF(TRIM(new.raw_user_meta_data->>'referral_code'), '');
  
  -- Find referrer if code is valid
  IF given_referral_code IS NOT NULL THEN
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = given_referral_code;
  END IF;

  -- Determine Username
  -- 1. Try metadata username
  -- 2. Try name from email
  -- 3. Fallback to 'user'
  base_username := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'username'), ''),
    split_part(new.email, '@', 1),
    'user'
  );
  
  -- Clean username (alphanumeric only, lowercase)
  base_username := LOWER(REGEXP_REPLACE(base_username, '[^a-zA-Z0-9]', '', 'g'));

  -- Ensure username is at least 3 chars
  IF LENGTH(base_username) < 3 THEN
    base_username := base_username || 'user';
  END IF;

  -- Ensure uniqueness of username
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  -- Generate a unique referral code for the new user
  -- Ensure generate_unique_referral_code exists, otherwise fallback
  BEGIN
    generated_code := generate_unique_referral_code(final_username);
  EXCEPTION WHEN OTHERS THEN
    -- Fallback simple code generation if function fails
    generated_code := UPPER(SUBSTRING(final_username FROM 1 FOR 4)) || floor(random() * 10000)::text;
  END;

  -- Insert new profile
  INSERT INTO public.profiles (id, full_name, username, avatar_url, role, referral_code, referred_by)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', final_username),
    final_username,
    new.raw_user_meta_data->>'avatar_url',
    'user', -- Default role
    generated_code,
    referrer_id
  );

  -- Award XP to referrer if exists
  IF referrer_id IS NOT NULL THEN
    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + 500
    WHERE id = referrer_id;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
