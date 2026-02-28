-- 1. Explicitly point quiz_results.user_id to public.profiles(id)
-- This allows Supabase/PostgREST to detect the relationship for nested joins like quiz_results(profiles(*)).

ALTER TABLE public.quiz_results
DROP CONSTRAINT IF EXISTS quiz_results_user_id_fkey;

ALTER TABLE public.quiz_results
ADD CONSTRAINT quiz_results_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 2. Verify and re-apply RLS for assigned results visibility
-- This ensures that learners can see all results associated with their class assignments.

DROP POLICY IF EXISTS "Students can view results for their assignments" ON public.quiz_results;

CREATE POLICY "Students can view results for their assignments" ON public.quiz_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_assignments
            WHERE quiz_assignments.id = quiz_results.assignment_id
            AND public.is_enrolled_student(quiz_assignments.class_id)
        )
    );

-- Also ensure instructors can see results for assignments they created
DROP POLICY IF EXISTS "Instructors can view results for their assignments" ON public.quiz_results;

CREATE POLICY "Instructors can view results for their assignments" ON public.quiz_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_assignments
            WHERE quiz_assignments.id = quiz_results.assignment_id
            AND quiz_assignments.instructor_id = auth.uid()
        )
    );
