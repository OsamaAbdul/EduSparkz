// quizUtils.js
import openai from '../config/openai.js';

// Determine level based on score percentage
export const determineLevel = (scorePercentage) => {
  if (scorePercentage >= 90) return 'Advanced';
  if (scorePercentage >= 70) return 'Intermediate';
  if (scorePercentage >= 50) return 'Beginner';
  return 'Novice';
};

// Generate AI-powered motivational message
export const getMotivationalMessage = async (scorePercentage, avgAnswerTime) => {
  try {
    // Categorize mood and speed
    const mood = scorePercentage >= 90 ? 'confident' : scorePercentage >= 70 ? 'progressing' : scorePercentage >= 50 ? 'steady' : 'struggling';
    const speed = avgAnswerTime < 5 ? 'fast' : avgAnswerTime < 15 ? 'average' : 'slow';

    // Craft prompt for AI
    const prompt = `
      Generate a concise humanized motivational message in pidgin english (1-2 sentences, max 50 words) for a quiz app user based on their performance.
      - Mood: ${mood} (score percentage: ${scorePercentage.toFixed(2)}%)
      - Answer speed: ${speed} (average time per question: ${avgAnswerTime.toFixed(2)} seconds)
      - Use an encouraging tone tailored to the user's mood and speed.
      - Examples:
        - Confident/Fast: "You're crushing it with lightning speed! Keep shining!"
        - Struggling/Slow: "No rush—each question helps you grow. Keep going!"
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at crafting concise and humanized motivational messages for quiz app users in pidgin english.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();
    if (!message) {
      throw new Error('No message generated');
    }
    return message;
  } catch (error) {
    console.error('Error generating motivational message:', error.message);
    // Fallback to static messages
    if (scorePercentage >= 90) return 'Outstanding performance! You\'re a quiz master!';
    if (scorePercentage >= 70) return 'Great job! Keep practicing to reach the top!';
    if (scorePercentage >= 50) return 'Good effort! A bit more study, and you\'ll shine!';
    return 'Don\'t give up! Every attempt makes you stronger!';
  }
};