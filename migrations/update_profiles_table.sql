-- Add is_active column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add username column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Create index on role for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create index on is_active for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Ensure admin user exists
INSERT INTO profiles (id, email, full_name, username, role, is_active)
VALUES 
  ('admin-user-id', 'gogiapandie@gmail.com', 'Admin User', 'admin', 'admin', true)
ON CONFLICT (email) DO UPDATE 
SET role = 'admin', username = 'admin', is_active = true;
