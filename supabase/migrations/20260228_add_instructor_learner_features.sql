-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Define Schools Table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    instructor_id UUID REFERENCES auth.users(id) NOT NULL
);

-- 3. Define Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    instructor_id UUID REFERENCES auth.users(id) NOT NULL
);

-- 4. Define Class Enrollments Table
CREATE TABLE IF NOT EXISTS public.class_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(class_id, user_id)
);

-- 5. Define Quiz Assignments Table
CREATE TABLE IF NOT EXISTS public.quiz_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES auth.users(id) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER, -- Optional: fixed duration from when student starts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Add assignment_id to quiz_results
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quiz_results' AND column_name='assignment_id') THEN
        ALTER TABLE public.quiz_results ADD COLUMN assignment_id UUID REFERENCES public.quiz_assignments(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 7. Add RLS Policies
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_assignments ENABLE ROW LEVEL SECURITY;

-- Schools: Instructors can manage their own schools. All members (if any) can view.
CREATE POLICY "Instructors can manage their own schools" ON public.schools
    FOR ALL USING (auth.uid() = instructor_id);

-- Classes: Instructors can manage their own classes.
CREATE POLICY "Instructors can manage their own classes" ON public.classes
    FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Enrolled students can view their classes" ON public.classes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.class_enrollments 
            WHERE class_enrollments.class_id = classes.id 
            AND class_enrollments.user_id = auth.uid()
        )
    );

-- Class Enrollments: Instructors can manage enrollments for their classes.
CREATE POLICY "Instructors can manage enrollments" ON public.class_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.classes 
            WHERE classes.id = class_enrollments.class_id 
            AND classes.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own enrollments" ON public.class_enrollments
    FOR SELECT USING (user_id = auth.uid());

-- Quiz Assignments: Instructors can manage assignments. Students can view assigned quizzes.
CREATE POLICY "Instructors can manage quiz assignments" ON public.quiz_assignments
    FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Students can view assigned quizzes" ON public.quiz_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.class_enrollments 
            WHERE class_enrollments.class_id = quiz_assignments.class_id 
            AND class_enrollments.user_id = auth.uid()
        )
    );

-- 8. Add instructor/learner roles logic to profiles if not present
-- Note: Assuming 'admin' and 'user' exist. 'instructor' and 'learner' can be roles or handled via logic.
-- For now, let's just ensure the role column supports these if it's an enum or check constraint.
-- If it's just TEXT, we're good. If it's an enum, we might need an ALTER TYPE.
-- Based on previous findings, profiles has a 'role' column.

DO $$ 
BEGIN 
    -- Check if 'instructor' and 'learner' are valid roles or if we need to add them.
    -- This depends on if 'profiles.role' is an enum. 
    -- For simplicity, let's just use the existing role column and handle logic in app.
END $$;
