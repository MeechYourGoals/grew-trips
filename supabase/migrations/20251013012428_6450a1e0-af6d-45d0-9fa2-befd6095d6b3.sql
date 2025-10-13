-- Move extensions out of public schema to extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pgvector extension to extensions schema
DROP EXTENSION IF EXISTS vector CASCADE;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Update search path to include extensions schema
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Ensure all vector functions are accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA extensions GRANT EXECUTE ON FUNCTIONS TO postgres, anon, authenticated, service_role;