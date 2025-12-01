import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { user_id } = await req.json()

        if (!user_id) {
            throw new Error('User ID is required')
        }

        // 1. Fetch User Profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('learning_goals, learning_style')
            .eq('id', user_id)
            .single()

        if (profileError) throw profileError

        const goals = profile.learning_goals || []
        const style = profile.learning_style || 'General'

        // 2. Generate Path Content (Mock Logic for now)
        // In a real scenario, this would call an LLM with the goals and style
        const pathTitle = `Mastering ${goals[0] || 'General Knowledge'}`
        const pathDescription = `A personalized learning path tailored for your ${style} learning style, focusing on ${goals.join(', ')}.`

        const items = [
            {
                title: "Introduction to Fundamentals",
                description: "Start with the basics to build a strong foundation.",
                resource_url: "https://example.com/intro",
                order_index: 0
            },
            {
                title: "Deep Dive into Core Concepts",
                description: `Explore advanced topics related to ${goals[0] || 'your goals'}.`,
                resource_url: "https://example.com/core",
                order_index: 1
            },
            {
                title: "Practical Application",
                description: "Apply what you've learned with hands-on exercises.",
                resource_url: "https://example.com/practice",
                order_index: 2
            },
            {
                title: "Final Assessment",
                description: "Test your knowledge and earn your certificate.",
                resource_url: "https://example.com/test",
                order_index: 3
            }
        ]

        // 3. Save to Database
        // First, create the path
        const { data: pathData, error: pathError } = await supabase
            .from('learning_paths')
            .insert({
                user_id,
                title: pathTitle,
                description: pathDescription
            })
            .select()
            .single()

        if (pathError) throw pathError

        // Then, create the items
        const itemsToInsert = items.map(item => ({
            path_id: pathData.id,
            ...item
        }))

        const { error: itemsError } = await supabase
            .from('learning_path_items')
            .insert(itemsToInsert)

        if (itemsError) throw itemsError

        return new Response(
            JSON.stringify({ path: pathData, items: itemsToInsert }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
