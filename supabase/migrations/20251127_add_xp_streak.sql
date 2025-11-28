-- Add XP and Streak columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_quiz_date TIMESTAMP WITH TIME ZONE;

-- Function to update XP and Streak
CREATE OR REPLACE FUNCTION update_user_xp_and_streak(
  p_user_id UUID,
  p_xp_gained INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_quiz_date TIMESTAMP WITH TIME ZONE;
  v_current_streak INTEGER;
  v_now TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
  -- Get current stats
  SELECT last_quiz_date, current_streak INTO v_last_quiz_date, v_current_streak
  FROM profiles
  WHERE id = p_user_id;

  -- Handle NULLs
  v_current_streak := COALESCE(v_current_streak, 0);

  -- Calculate new streak
  IF v_last_quiz_date IS NULL THEN
    -- First quiz ever
    v_current_streak := 1;
  ELSIF v_last_quiz_date::DATE = (v_now - INTERVAL '1 day')::DATE THEN
    -- Continued streak (yesterday)
    v_current_streak := v_current_streak + 1;
  ELSIF v_last_quiz_date::DATE = v_now::DATE THEN
    -- Same day, streak doesn't change, just keep it
    v_current_streak := v_current_streak;
  ELSE
    -- Streak broken
    v_current_streak := 1;
  END IF;

  -- Update profile
  UPDATE profiles
  SET 
    xp = COALESCE(xp, 0) + p_xp_gained,
    current_streak = v_current_streak,
    last_quiz_date = v_now
  WHERE id = p_user_id;
END;
$$;
