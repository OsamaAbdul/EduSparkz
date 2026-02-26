import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Supabase configuration missing')
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Get the authorization header from the request
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        // Verify the user
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabase.auth.getUser(token)

        if (userError || !user) {
            throw new Error('Invalid token')
        }

        const { platform, handle, postId } = await req.json()

        if (!platform) {
            throw new Error('Platform is required')
        }

        let isVerified = false;

        if (platform === 'github') {
            if (!handle) throw new Error('GitHub handle is required')
            // Check if user follows edu-sparkz on GitHub
            // Note: This requires the user's github handle
            // In a real app, we'd get this via GitHub OAuth or ask them to enter it
            const targetUser = 'edu-sparkz'
            const response = await fetch(`https://api.github.com/users/${handle}/following/${targetUser}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'EduSparkz-Verifier'
                }
            })

            if (response.status === 204) {
                isVerified = true
            }
        } else if (platform === 'twitter') {
            // For Twitter, we verify a post/tweet
            // requires a Twitter API token (Bearer token)
            const twitterToken = Deno.env.get('TWITTER_BEARER_TOKEN')
            if (!twitterToken) {
                throw new Error('Twitter API token not configured')
            }

            if (!postId) throw new Error('Tweet ID or Link is required')

            const response = await fetch(`https://api.twitter.com/2/tweets/${postId}?expansions=author_id&tweet.fields=text`, {
                headers: {
                    'Authorization': `Bearer ${twitterToken}`
                }
            })
            const data = await response.json()

            if (data.data) {
                const text = data.data.text.toLowerCase()
                if (text.includes('edusparkz') || text.includes('@edu_sparkz')) {
                    isVerified = true
                }
            }
        }

        if (isVerified) {
            // Update the user's profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    followed_socials: true,
                    social_proof_data: JSON.stringify({ platform, handle, verified_at: new Date().toISOString() })
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            return new Response(
                JSON.stringify({ success: true, message: 'Verification successful! Your limits have been upgraded.' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        } else {
            return new Response(
                JSON.stringify({ success: false, message: 'Verification failed. Please make sure you followed the instructions.' }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
