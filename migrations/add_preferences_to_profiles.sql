-- Add preferences column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Update existing profiles to have default preferences
UPDATE profiles SET preferences = '{
  "theme": "system",
  "emailNotifications": true,
  "dashboardLayout": "grid",
  "language": "en"
}'::jsonb WHERE preferences IS NULL;
