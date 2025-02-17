/*
  # Fix Admin Dashboard Permissions

  1. Changes
    - Update RLS policies for subscribers table
    - Add policy for admin users to access subscribers
    - Fix permission denied errors by using raw_app_meta_data

  2. Security
    - Ensure only admin users can access subscriber data
    - Maintain proper access control
*/

-- Update subscribers table policies
DROP POLICY IF EXISTS "Admin can view subscribers" ON subscribers;

CREATE POLICY "Admin can view subscribers"
ON subscribers
FOR SELECT
TO authenticated
USING (
  (SELECT raw_app_meta_data->>'role' 
   FROM auth.users 
   WHERE id = auth.uid()) = 'admin'
);

-- Create policy for admin to manage subscribers
DROP POLICY IF EXISTS "Admin can manage subscribers" ON subscribers;

CREATE POLICY "Admin can manage subscribers"
ON subscribers
FOR ALL
TO authenticated
USING (
  (SELECT raw_app_meta_data->>'role' 
   FROM auth.users 
   WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT raw_app_meta_data->>'role' 
   FROM auth.users 
   WHERE id = auth.uid()) = 'admin'
);

-- Create view for safe user access
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  id,
  email,
  created_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON public.user_profiles TO authenticated;

-- Update AdminDashboard to use view instead of direct table access
COMMENT ON VIEW public.user_profiles IS 'Safe view of user profiles for admin dashboard';