-- Create a table to track password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- Add an index on the token for faster lookups
  CONSTRAINT idx_password_reset_tokens_token UNIQUE (token)
);

-- Add a function to automatically clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_password_reset_tokens()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW() OR used_at IS NOT NULL;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the cleanup function periodically
DROP TRIGGER IF EXISTS trigger_cleanup_expired_password_reset_tokens ON password_reset_tokens;
CREATE TRIGGER trigger_cleanup_expired_password_reset_tokens
AFTER INSERT ON password_reset_tokens
EXECUTE FUNCTION cleanup_expired_password_reset_tokens();

-- Add an index on expires_at for the cleanup function
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
