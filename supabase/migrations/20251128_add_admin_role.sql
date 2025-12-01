-- Add role column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Update RLS for profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can delete all profiles"
ON public.profiles FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- Update RLS for materials
CREATE POLICY "Admins can view all materials"
ON public.materials FOR SELECT
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can delete all materials"
ON public.materials FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- Update RLS for quiz_results
CREATE POLICY "Admins can view all quiz_results"
ON public.quiz_results FOR SELECT
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can delete all quiz_results"
ON public.quiz_results FOR DELETE
USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
