-- 1. Allow students to view assigned quiz details
-- Using the helper function is_enrolled_student(class_id) for security and consistency.

DROP POLICY IF EXISTS "Students can view assigned quiz details" ON public.quizzes;

CREATE POLICY "Students can view assigned quiz details" ON public.quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_assignments
            WHERE quiz_assignments.quiz_id = quizzes.id
            AND public.is_enrolled_student(quiz_assignments.class_id)
        )
    );

-- 2. Allow students to view results for assignments they are part of (for leaderboard)
DROP POLICY IF EXISTS "Students can view results for their assignments" ON public.quiz_results;

CREATE POLICY "Students can view results for their assignments" ON public.quiz_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quiz_assignments
            WHERE quiz_assignments.id = quiz_results.assignment_id
            AND public.is_enrolled_student(quiz_assignments.class_id)
        )
    );
