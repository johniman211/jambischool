-- Fix infinite recursion in profiles RLS policies
-- Run this in Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their schools" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create a helper function that bypasses RLS to check super admin status
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT is_super_admin INTO is_admin
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate profiles policies without recursion

-- Users can view their own profile (simple, no recursion)
-- This policy already exists, keeping it

-- Users can view profiles in their schools (no profiles table reference)
CREATE POLICY "Users can view profiles in their schools"
ON profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM school_memberships sm1
    JOIN school_memberships sm2 ON sm1.school_id = sm2.school_id
    WHERE sm1.user_id = auth.uid() 
    AND sm2.user_id = profiles.id
    AND sm1.is_active = true
    AND sm2.is_active = true
  )
);

-- Super admins can view all profiles (using the SECURITY DEFINER function)
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (public.is_super_admin());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Also fix the schools policies that may cause issues
DROP POLICY IF EXISTS "Super admins can create schools" ON schools;

-- Allow any authenticated user to create a school (they become the admin)
CREATE POLICY "Authenticated users can create schools"
ON schools FOR INSERT
TO authenticated
WITH CHECK (true);

-- Fix school_memberships to allow users to add themselves when creating a school
DROP POLICY IF EXISTS "School admins can insert memberships" ON school_memberships;

CREATE POLICY "Users can create membership for new schools"
ON school_memberships FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() OR
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- Grant execute on the function
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
