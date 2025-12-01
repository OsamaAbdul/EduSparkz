-- 1. Add referral columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id);

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- 2. Function to generate a unique referral code based on username
CREATE OR REPLACE FUNCTION generate_unique_referral_code(base_name TEXT) 
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  counter INT := 0;
BEGIN
  -- Clean the base name: remove non-alphanumeric, uppercase, default to 'USER'
  base_name := UPPER(REGEXP_REPLACE(COALESCE(base_name, 'USER'), '[^a-zA-Z0-9]', '', 'g'));
  
  IF LENGTH(base_name) < 3 THEN
    base_name := base_name || 'CODE';
  END IF;

  new_code := base_name;
  
  -- Loop to ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code) LOOP
    counter := counter + 1;
    new_code := base_name || counter::TEXT;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- 3. Backfill existing users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, username, full_name FROM public.profiles WHERE referral_code IS NULL LOOP
    UPDATE public.profiles
    SET referral_code = generate_unique_referral_code(COALESCE(r.username, r.full_name))
    WHERE id = r.id;
  END LOOP;
END $$;

-- 4. Update handle_new_user trigger to handle referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  referrer_id UUID;
  given_referral_code TEXT;
  generated_code TEXT;
  final_username TEXT;
  base_username TEXT;
  temp_username TEXT;
  counter INT := 0;
BEGIN
  -- Extract referral code from metadata if provided
  given_referral_code := new.raw_user_meta_data->>'referral_code';
  
  -- Find referrer if code is valid
  IF given_referral_code IS NOT NULL THEN
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = given_referral_code;
  END IF;

  -- Determine Username
  -- 1. Try metadata username
  -- 2. Try name from email
  -- 3. Fallback to 'user'
  base_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1),
    'user'
  );
  
  -- Clean username (alphanumeric only)
  base_username := REGEXP_REPLACE(base_username, '[^a-zA-Z0-9]', '', 'g');

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
  generated_code := generate_unique_referral_code(final_username);

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
