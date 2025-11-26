import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { score, total, avgTimePerQuestion } = await req.json()

        const prompt = `
      You are a funny and encouraging teacher. The student just finished a quiz.
      
      Performance Stats:
      - Score: ${score}/${total}
      - Average Time per Question: ${avgTimePerQuestion.toFixed(2)} seconds
      
      Generate a short, spicy, and motivational message in **Nigerian Pidgin English** based on their performance.
      
      Guidelines:
      - If score is high (>80%) and fast (<15s): Praise them heavily (e.g., "Omo, you be wizard! You tear the quiz pieces!").
      - If score is high (>80%) but slow: Praise accuracy (e.g., "Soft work! You take your time finish am well.").
      - If score is average (50-79%): Encourage them (e.g., "You try well well, but you fit do pass this one.").
      - If score is low (<50%): Don't discourage, tell them to try again (e.g., "No wahala, na small small. Go read book come back!").
      
      Output ONLY the message string. No quotes.
    `;

        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
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

        const message = aiData.candidates[0].content.parts[0].text.trim();

        return new Response(
            JSON.stringify({ message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
