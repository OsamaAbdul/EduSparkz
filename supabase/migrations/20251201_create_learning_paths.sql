-- Create learning_paths table
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create learning_path_items table
CREATE TABLE IF NOT EXISTS public.learning_path_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    resource_url TEXT,
    is_completed BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_items ENABLE ROW LEVEL SECURITY;

-- Policies for learning_paths
CREATE POLICY "Users can view their own learning paths"
    ON public.learning_paths FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning paths"
    ON public.learning_paths FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths"
    ON public.learning_paths FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learning paths"
    ON public.learning_paths FOR DELETE
    USING (auth.uid() = user_id);

-- Policies for learning_path_items
CREATE POLICY "Users can view items of their own paths"
    ON public.learning_path_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.learning_paths
            WHERE learning_paths.id = learning_path_items.path_id
            AND learning_paths.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert items to their own paths"
    ON public.learning_path_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.learning_paths
            WHERE learning_paths.id = learning_path_items.path_id
            AND learning_paths.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items of their own paths"
    ON public.learning_path_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.learning_paths
            WHERE learning_paths.id = learning_path_items.path_id
            AND learning_paths.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items of their own paths"
    ON public.learning_path_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.learning_paths
            WHERE learning_paths.id = learning_path_items.path_id
            AND learning_paths.user_id = auth.uid()
        )
    );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON public.learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_items_path_id ON public.learning_path_items(path_id);
