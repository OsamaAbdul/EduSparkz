-- Allow users to update their own quizzes
CREATE POLICY "Users can update their own quizzes."
  ON public.quizzes FOR UPDATE
  USING (auth.uid() = user_id);
