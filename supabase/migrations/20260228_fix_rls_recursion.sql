-- 1. Create helper functions with SECURITY DEFINER to bypass RLS recursion
-- These functions allow checking relationships without triggering the table's own RLS policies.

CREATE OR REPLACE FUNCTION public.is_class_instructor(cid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = cid AND instructor_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_enrolled_student(cid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.class_enrollments
    WHERE class_id = cid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Enrolled students can view their classes" ON public.classes;
DROP POLICY IF EXISTS "Instructors can manage enrollments" ON public.class_enrollments;

-- 3. Re-create policies using the helper functions
-- This breaks the infinite loop because the functions bypass RLS when querying.

CREATE POLICY "Enrolled students can view their classes" ON public.classes
    FOR SELECT USING (
        is_enrolled_student(id)
    );

CREATE POLICY "Instructors can manage enrollments" ON public.class_enrollments
    FOR ALL USING (
        is_class_instructor(class_id)
    );

-- Also ensure Quiz Assignments doesn't recurse if it ever checks enrollments and classes simultaneously
DROP POLICY IF EXISTS "Students can view assigned quizzes" ON public.quiz_assignments;
CREATE POLICY "Students can view assigned quizzes" ON public.quiz_assignments
    FOR SELECT USING (
        is_enrolled_student(class_id)
    );
