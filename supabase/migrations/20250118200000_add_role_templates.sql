-- Create role_templates table for saving and reusing role configurations
CREATE TABLE IF NOT EXISTS role_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  roles JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_templates_created_by ON role_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_role_templates_organization ON role_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_role_templates_category ON role_templates(category);
CREATE INDEX IF NOT EXISTS idx_role_templates_public ON role_templates(is_public) WHERE is_public = true;

-- Enable RLS
ALTER TABLE role_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own templates and public templates
CREATE POLICY "Users can view own templates"
  ON role_templates FOR SELECT
  USING (auth.uid() = created_by OR is_public = true);

-- Users can create templates
CREATE POLICY "Users can create templates"
  ON role_templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own templates
CREATE POLICY "Users can update own templates"
  ON role_templates FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates"
  ON role_templates FOR DELETE
  USING (auth.uid() = created_by);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_role_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER role_templates_updated_at
  BEFORE UPDATE ON role_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_role_templates_updated_at();

