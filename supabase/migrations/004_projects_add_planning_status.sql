-- 004_projects_add_planning_status.sql
-- Add 'planning' to projects.status CHECK constraint.

DO $$
DECLARE
  c_name text;
BEGIN
  SELECT con.conname INTO c_name
  FROM pg_constraint con
  JOIN pg_class rel ON rel.oid = con.conrelid
  WHERE rel.relname = 'projects'
    AND con.contype = 'c'
    AND pg_get_constraintdef(con.oid) ILIKE '%status%IN%';

  IF c_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE projects DROP CONSTRAINT %I', c_name);
  END IF;

  ALTER TABLE projects
    ADD CONSTRAINT projects_status_check
    CHECK (status IN ('planning','active','completed','on-hold'));
END $$;
