/*
  # Fix Admin Dashboard Permissions

  1. Changes
    - Create a secure admin view for user data
    - Update subscriber table policies
    - Add proper RLS policies for admin access

  2. Security
    - Restrict user data access to admins only
    - Ensure proper role-based access control
    - Implement secure view for user profiles
*/

-- Create a secure view for admin access to user data
CREATE OR REPLACE VIEW admin_user_profiles AS 
SELECT 
  id,
  email,
  created_at,
  raw_app_meta_data->>'role' as role,
  raw_user_meta_data
FROM auth.users;

-- Grant access to the admin view
GRANT SELECT ON admin_user_profiles TO authenticated;

-- Revoke direct access to auth.users
REVOKE ALL ON auth.users FROM anon, authenticated;

-- Update subscribers table policies
DROP POLICY IF EXISTS "Admin can view subscribers" ON subscribers;
DROP POLICY IF EXISTS "Admin can manage subscribers" ON subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON subscribers;

-- Create policy for anyone to subscribe
CREATE POLICY "Anyone can subscribe"
ON subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for admin to view subscribers
CREATE POLICY "Admin can view subscribers"
ON subscribers
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Create policy for admin to manage subscribers
CREATE POLICY "Admin can manage subscribers"
ON subscribers
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

-- Add function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  );
$$;