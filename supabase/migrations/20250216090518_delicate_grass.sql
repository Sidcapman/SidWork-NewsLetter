/*
  # Fix Admin Access and Permissions

  1. Changes
    - Create is_admin() function with proper security
    - Create secure admin access to user data
    - Update subscriber policies
    - Add proper grants and security checks

  2. Security
    - Implement secure admin checks
    - Add proper policy checks for subscribers
*/

-- Create function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND raw_app_meta_data->>'role' = 'admin'
  );
$$;

-- Create secure function to get admin user data
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  role text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    id,
    email,
    created_at,
    raw_app_meta_data->>'role' as role
  FROM auth.users
  WHERE public.is_admin();
$$;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_users TO authenticated;

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
USING (public.is_admin());

-- Create policy for admin to manage subscribers
CREATE POLICY "Admin can manage subscribers"
ON subscribers
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());