-- Add social engagement columns to profiles
alter table profiles add column if not exists followed_socials boolean default false;
alter table profiles add column if not exists social_proof_data text;
