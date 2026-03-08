-- RLS Fix: service_role INSERT policy for users table
-- Drop potentially wrong policy and recreate correctly
DROP POLICY IF EXISTS "users_insert_service" ON users;

CREATE POLICY "users_insert_service" ON users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- DSGVO: remove public email-leak policy (already gone, idempotent)
DROP POLICY IF EXISTS "users_select_public" ON users;
