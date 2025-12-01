-- Fix infinite recursion in RLS policies by using a security definer function

-- Create a function to check if the user is an admin
-- SECURITY DEFINER means this function runs with the privileges of the creator (postgres), bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the problematic policies that caused recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Admins can view all materials" ON public.materials;
DROP POLICY IF EXISTS "Admins can delete all materials" ON public.materials;

DROP POLICY IF EXISTS "Admins can view all quiz_results" ON public.quiz_results;
DROP POLICY IF EXISTS "Admins can delete all quiz_results" ON public.quiz_results;

-- Re-create policies using the safe function

-- Profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete all profiles"
ON public.profiles FOR DELETE
USING (public.is_admin());

-- Materials
CREATE POLICY "Admins can view all materials"
ON public.materials FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can delete all materials"
ON public.materials FOR DELETE
USING (public.is_admin());

-- Quiz Results
CREATE POLICY "Admins can view all quiz_results"
ON public.quiz_results FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can delete all quiz_results"
ON public.quiz_results FOR DELETE
USING (public.is_admin());
