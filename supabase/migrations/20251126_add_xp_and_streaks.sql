-- Add XP, Streak, and Level columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Function to calculate level based on XP (Simple formula: Level = 1 + floor(sqrt(XP / 100)))
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN 1 + floor(sqrt(xp / 100));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to update level when XP changes
CREATE OR REPLACE FUNCTION update_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level(NEW.xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_xp_change
BEFORE UPDATE OF xp ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_level();
