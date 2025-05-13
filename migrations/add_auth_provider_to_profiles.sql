-- Add auth_provider column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';

-- Update existing profiles to have 'email' as the auth provider
UPDATE profiles SET auth_provider = 'email' WHERE auth_provider IS NULL;

-- Add an index on auth_provider for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_auth_provider ON profiles(auth_provider);

-- Add a comment to the column
COMMENT ON COLUMN profiles.auth_provider IS 'The authentication provider used by the user (email, google, github, etc.)';
