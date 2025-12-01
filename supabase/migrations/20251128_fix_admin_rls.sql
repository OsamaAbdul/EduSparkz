-- Fix RLS recursion by using a security definer function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Admins can view all materials" ON public.materials;
DROP POLICY IF EXISTS "Admins can delete all materials" ON public.materials;

DROP POLICY IF EXISTS "Admins can view all quiz_results" ON public.quiz_results;
DROP POLICY IF EXISTS "Admins can delete all quiz_results" ON public.quiz_results;

-- Re-create policies using is_admin()
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING ( is_admin() );

CREATE POLICY "Admins can delete all profiles"
ON public.profiles FOR DELETE
USING ( is_admin() );

CREATE POLICY "Admins can view all materials"
ON public.materials FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can delete all materials"
ON public.materials FOR DELETE
USING ( is_admin() );

CREATE POLICY "Admins can view all quiz_results"
ON public.quiz_results FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can delete all quiz_results"
ON public.quiz_results FOR DELETE
USING ( is_admin() );
