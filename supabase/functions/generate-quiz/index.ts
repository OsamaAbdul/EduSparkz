import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

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
        // Convert base64 to blob for OpenAI API
        // Decode base64 to binary
        const binaryString = atob(audio.split(',')[1]);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const file = new File([bytes], "recording.webm", { type: "audio/webm" });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", "whisper-1");

        const transcriptionResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          },
          body: formData,
        });

        const transcriptionData = await transcriptionResponse.json();
        if (transcriptionData.error) throw new Error(transcriptionData.error.message);
        processedText = transcriptionData.text;

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

    // Generate Quiz using OpenAI
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

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful AI that generates quizzes from text. Output ONLY valid JSON.' },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const aiData = await openAIResponse.json()

    if (aiData.error) {
      throw new Error(aiData.error.message)
    }

    let quizContent = aiData.choices[0].message.content
    // Clean up markdown code blocks if present
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
