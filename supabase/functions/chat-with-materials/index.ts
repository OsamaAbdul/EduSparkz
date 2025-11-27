import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query, context } = await req.json()

        if (!query) {
            return new Response(
                JSON.stringify({ error: 'Query is required' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const prompt = `
      You are a helpful AI study assistant.
      Use the following context (documents uploaded by the user) to answer the user's question.
      If the answer is not in the context, say you don't know based on the documents, but try to help with general knowledge if appropriate (but mention it's general knowledge).
      
      Context:
      ${context || "No documents selected."}
      
      User Question:
      ${query}
    `;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        })

        const aiData = await geminiResponse.json()

        if (aiData.error) {
            throw new Error(aiData.error.message)
        }

        const reply = aiData.candidates[0].content.parts[0].text

        return new Response(
            JSON.stringify({
                reply: reply
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
