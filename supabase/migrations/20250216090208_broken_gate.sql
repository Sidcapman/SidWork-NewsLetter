/*
  # Fix Admin Access and Dashboard

  1. Changes
    - Create is_admin() function for checking admin status
    - Create admin_users view for secure user data access
    - Update RLS policies for subscribers table
    - Add proper grants and security checks

  2. Security
    - Enable RLS on all views
    - Add policies for admin access
    - Implement proper role checks
*/

-- Create function to check admin status
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

-- Create secure view for admin access to user data
CREATE OR REPLACE VIEW public.admin_users AS 
SELECT 
  id,
  email,
  created_at,
  raw_app_meta_data->>'role' as role
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.admin_users TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.admin_users SET (security_invoker = true);

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
  public.is_admin()
);

-- Create policy for admin to manage subscribers
CREATE POLICY "Admin can manage subscribers"
ON subscribers
FOR ALL
TO authenticated
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);