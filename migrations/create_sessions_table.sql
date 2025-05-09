-- Create sessions table to track user login sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_info TEXT NOT NULL,
  browser TEXT NOT NULL,
  operating_system TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  location TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_agent TEXT,
  is_remembered BOOLEAN DEFAULT FALSE
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_is_current_idx ON sessions(is_current);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

-- Add function to automatically clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run cleanup function periodically
DROP TRIGGER IF EXISTS trigger_cleanup_expired_sessions ON sessions;
CREATE TRIGGER trigger_cleanup_expired_sessions
AFTER INSERT ON sessions
EXECUTE PROCEDURE cleanup_expired_sessions();
