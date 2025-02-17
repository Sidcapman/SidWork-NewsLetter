/*
  # Fix User Access and Permissions

  1. Changes
    - Create a secure view for user data
    - Update RLS policies for subscribers table
    - Grant necessary permissions

  2. Security
    - Ensure only admin users can access subscriber data
    - Provide secure access to user information
    - Maintain proper access control
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.user_profiles;

-- Create a secure view for user data
CREATE VIEW public.user_profiles AS
SELECT 
  id,
  email,
  created_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_profiles TO authenticated;

-- Update subscribers table policies
DROP POLICY IF EXISTS "Admin can view subscribers" ON subscribers;
DROP POLICY IF EXISTS "Admin can manage subscribers" ON subscribers;

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
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
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
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_app_meta_data->>'role' = 'admin'
  )
);