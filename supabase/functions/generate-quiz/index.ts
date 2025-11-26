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
    const { text, userPrompt, quizCount = 5, title, quizType = 'mixed', url, audio } = await req.json()
    let processedText = text || "";

    // Handle URL input
    if (url) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        // Simple regex to strip HTML tags - in production use a proper parser or service
        processedText = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().substring(0, 15000); // Limit length
      } catch (e) {
        throw new Error(`Failed to fetch URL: ${e.message}`);
      }
    }

    // Handle Audio input (Base64)
    if (audio) {
      try {
        // Extract base64 data (remove "data:audio/webm;base64," prefix if present)
        const base64Data = audio.split(',')[1] || audio;

        const geminiAudioResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "Transcribe the following audio exactly as it is spoken." },
                { inline_data: { mime_type: "audio/webm", data: base64Data } }
              ]
            }]
          }),
        });

        const transcriptionData = await geminiAudioResponse.json();
        if (transcriptionData.error) throw new Error(transcriptionData.error.message);

        processedText = transcriptionData.candidates[0].content.parts[0].text;

      } catch (e) {
        throw new Error(`Audio transcription failed: ${e.message}`);
      }
    }

    if (!processedText) {
      return new Response(
        JSON.stringify({ success: false, error: 'No text content provided via file, url, or audio.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Generate Quiz using Gemini
    const prompt = `
      Generate a ${quizCount}-question quiz based on the following text.
      Quiz Type: ${quizType} (If 'mixed', include both Multiple Choice and True/False. If 'multiple-choice', only MCQs. If 'true-false', only T/F).
      
      Format the output as a JSON array of objects.
      Each object should have:
      - question: string
      - options: array of strings (for True/False, use ["True", "False"])
      - answer: string (must be one of the options)
      
      Text:
      ${processedText.substring(0, 15000)}
      
      ${userPrompt ? `Additional Instructions: ${userPrompt}` : ''}
    `;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${Deno.env.get('GEMINI_API_KEY')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    })

    const aiData = await geminiResponse.json()

    if (aiData.error) {
      throw new Error(aiData.error.message)
    }

    let quizContent = aiData.candidates[0].content.parts[0].text
    // Clean up markdown code blocks if present (though responseMimeType should handle it, it's good to be safe)
    quizContent = quizContent.replace(/```json/g, '').replace(/```/g, '').trim()

    let questions;
    try {
      questions = JSON.parse(quizContent);
    } catch (e) {
      console.error("JSON Parse Error:", quizContent);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate and fix questions
    questions = questions.map((q: any) => {
      // Ensure options exist
      if (!q.options || !Array.isArray(q.options)) {
        if (q.answer && (q.answer.toLowerCase() === 'true' || q.answer.toLowerCase() === 'false')) {
          q.options = ["True", "False"];
        } else {
          // Fallback or error? Let's try to infer or skip
          q.options = ["Option A", "Option B", "Option C", "Option D"];
        }
      }
      return q;
    });

    // Save to Database
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: title || 'Generated Quiz',
        questions: questions,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (quizError) throw quizError

    return new Response(
      JSON.stringify({
        success: true,
        quizId: quizData.id,
        title: quizData.title,
        extractedText: processedText // Return this so frontend can save it
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
