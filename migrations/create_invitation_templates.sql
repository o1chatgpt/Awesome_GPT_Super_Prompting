-- Create invitation templates table
CREATE TABLE IF NOT EXISTS invitation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add template_id to invitations table
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES invitation_templates(id);

-- Create default template
INSERT INTO invitation_templates (name, subject, content, is_default)
VALUES (
  'Default Template',
  'Invitation to join Web Scraper Interface',
  E'<p>Hello,</p>\n<p>You have been invited to join the Web Scraper Interface as a {{role}}.</p>\n<p>Please click the link below to complete your registration:</p>\n<p>{{invitation_link}}</p>\n<p>This invitation will expire in 7 days.</p>\n<p>Best regards,<br>{{inviter_name}}</p>',
  true
) ON CONFLICT DO NOTHING;
