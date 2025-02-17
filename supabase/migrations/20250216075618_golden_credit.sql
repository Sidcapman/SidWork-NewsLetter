/*
  # Final Fix for Admin Dashboard Permissions

  1. Changes
    - Create secure admin access view
    - Update RLS policies for subscribers
    - Add proper security policies
    - Fix permission issues for admin dashboard

  2. Security
    - Ensure proper RLS policies
    - Secure view access
    - Proper role-based access control
*/

-- Drop existing view if exists
DROP VIEW IF EXISTS public.user_profiles;

-- Create a secure view for user data with role information
CREATE OR REPLACE VIEW public.user_profiles AS 
SELECT 
  id,
  email,
  created_at,
  CASE 
    WHEN raw_app_meta_data->>'role' = 'admin' THEN 'admin'
    ELSE 'user'
  END as role
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_profiles TO authenticated;

-- Revoke all on subscribers from public
REVOKE ALL ON subscribers FROM public;

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
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- Create policy for admin to manage subscribers
CREATE POLICY "Admin can manage subscribers"
ON subscribers
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_app_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND raw_app_meta_data->>'role' = 'admin'
  )
);

-- Add comment for documentation
COMMENT ON VIEW public.user_profiles IS 'Secure view of user profiles with role information for admin dashboard';