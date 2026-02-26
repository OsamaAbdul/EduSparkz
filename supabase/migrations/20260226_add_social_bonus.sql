-- Add last_social_engagement_date column to profiles table to track daily engagement bonus eligibility.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_social_engagement_date DATE;
