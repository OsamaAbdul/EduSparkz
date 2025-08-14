import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import openai from '../config/openai.js';
import rateLimiter from '../config/rateLimiter.js';
import auth from '../middleware/auth.js';
import { Quiz, QuizResult } from '../models/Quiz.js';
import { determineLevel, getMotivationalMessage } from '../utils/quizUtils.js';
import PDFParser from 'pdf2json';
import { fromBuffer } from 'pdf2pic';
import Tesseract from 'tesseract.js';



const router = express.Router();

// ==== avoiding setting up fake worker====

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0].includes('Setting up fake worker')) return;
  originalConsoleWarn(...args);
};

// =====pdf extraction=====
router.post('/extract-pdf-text', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const file = req.files.file;
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return res.status(400).json({ error: 'File size exceeds 10MB limit' });
  }
  if (file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Only PDF files are allowed' });
  }

  try {
    // Try text-based PDF extraction with pdf2json
    const pdfParser = new PDFParser(null, true); // Skip form fields
    let text = '';

    // Wrap pdf2json in a Promise for async/await
    const pdf2jsonPromise = new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData) => reject(new Error(errData.parserError)));
      pdfParser.on('pdfParser_dataReady', () => resolve(pdfParser.getRawTextContent()));
      pdfParser.parseBuffer(file.data);
    });

    try {
      text = await pdf2jsonPromise;
      // If text is extracted and non-trivial, return it
      if (text && text.trim().length > 50) { // Adjust threshold as needed
        return res.json({ text });
      }
    } catch (err) {
      console.warn('pdf2json failed, falling back to OCR:', err.message);
    }

    // Fallback to OCR for scanned PDFs
    const output = {
      format: 'png', // Output images as PNG buffers
      max: 1, // Process only the first page (adjust as needed)
    };
    const convert = fromBuffer(file.data, output);
    const images = await convert.bulk(-1); // Convert all pages to image buffers

    // Perform OCR on each image
    const ocrPromises = images.map(async (image, index) => {
      try {
        const { data: { text } } = await Tesseract.recognize(image.buffer, 'eng');
        return text;
      } catch (err) {
        console.warn(`OCR failed for page ${index + 1}:`, err.message);
        return '';
      }
    });

    const ocrResults = await Promise.all(ocrPromises);
    text = ocrResults.join('\n');

    if (!text.trim()) {
      return res.status(500).json({ error: 'No text could be extracted from the PDF' });
    }

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: `Text extraction failed: ${err.message}` });
  }
});


class APIError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Enhanced text cleaning
const cleanExtractedText = (text) => {
  if (!text?.trim()) return '';

  const cleaningSteps = [
    { pattern: /Page \d+ of \d+\n/g, replace: '' },
    { pattern: /^\s*\d+\s*\|\s*.+\n/gm, replace: '' },
    { pattern: /\s*\n\s*\n\s*/g, replace: '\n\n' },
    { pattern: /\t+/g, replace: ' ' },
    { pattern: /\s{2,}/g, replace: ' ' },
    { pattern: /[^\x20-\x7E\n\u2013\u2014\u2018\u2019\u201C\u201D]/g, replace: '' },
    { pattern: /^\s*[\d•]\s*$/gm, replace: '' }
  ];

  let cleaned = cleaningSteps.reduce(
    (acc, { pattern, replace }) => acc.replace(pattern, replace),
    text.trim()
  );

  const sectionPatterns = [
    /^[A-Z][A-Z\s]{3,}(:|\s*$)/gm,
    /^(Chapter|Section|Part)\s+\w+/gmi,
    /^\d+\.\s+.+/gm,
    /^[A-Z][a-z]+(?: [A-Z][a-z]+)*:/gm
  ];

  const noiseKeywords = [
    'table of contents', 'appendix', 'references', 'bibliography', 'index',
    'copyright', 'acknowledgments', 'disclaimer', 'header', 'footer'
  ];

  const sections = [];
  let currentSection = '';
  const lines = cleaned.split('\n').filter(line => line.trim().length > 5);

  for (const line of lines) {
    if (sectionPatterns.some(pattern => pattern.test(line))) {
      if (currentSection && !noiseKeywords.some(keyword => currentSection.toLowerCase().includes(keyword))) {
        sections.push(currentSection.trim());
      }
      currentSection = line;
    } else {
      currentSection += ` ${line}`;
    }
  }
  if (currentSection && !noiseKeywords.some(keyword => currentSection.toLowerCase().includes(keyword))) {
    sections.push(currentSection.trim());
  }

  return sections
    .filter(s => s.length > 20)
    .join('\n\n');
};

// Generate MCQ prompt
const generateMCQPrompt = (quizCount, text, userPrompt) => {
  const sanitizedPrompt = userPrompt ? sanitizeHtml(userPrompt, { allowedTags: [] }) : '';
  return `
    Generate strictly ${quizCount} MCQs based on the following text. Ensure questions are of medium difficulty, include at least one true/false question, and follow this format:
    Question 1: [Question text]
    A) Option 1
    B) Option 2
    C) Option 3
    D) Option 4
    Correct Answer: [Letter]
    Explanation: [1-2 sentence explanation]
    Text: ${text}
    ${sanitizedPrompt ? `\nAdditional instructions: ${sanitizedPrompt}` : ''}
  `;
};

// Enhanced MCQ generation without caching
const generateMCQsFromText = async (extractedText, quizCount, userPrompt) => {
  const validationErrors = [];
  if (!extractedText || extractedText.length < 50) {
    validationErrors.push('Extracted text too short (min 50 chars)');
  }
  if (quizCount < 1 || quizCount > 20) {
    validationErrors.push('Quiz count must be between 1-20');
  }
  if (validationErrors.length) {
    throw new APIError('Invalid MCQ generation parameters', 400, validationErrors);
  }

  try {
    const prompt = generateMCQPrompt(quizCount, extractedText, userPrompt);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert quiz generator. Create clear, accurate MCQs in the specified format.`
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: Math.min(4000, quizCount * 400),
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    throw new APIError(
      error.message.includes('rate limit') ? 'Rate limit exceeded' : 'AI service unavailable',
      503,
      { originalError: error.message }
    );
  }
};

// Parse MCQs
const parseMCQs = (responseText) => {
  const mcqs = [];
  if (!responseText || typeof responseText !== 'string') {
    console.log('Invalid OpenAI response:', responseText);
    return mcqs;
  }

  const questionBlocks = responseText.split(/(?=Question \d+:)/);
  for (const block of questionBlocks) {
    const match = block.match(/Question \d+: (.*?)\nA\) (.*?)\nB\) (.*?)\nC\) (.*?)\nD\) (.*?)\nCorrect Answer: ([A-D])\nExplanation: (.*)/is);
    if (match && match.length === 8) {
      const correctAnswer = match[6]?.trim().toUpperCase();
      let correctAnswerText;
      switch (correctAnswer) {
        case 'A': correctAnswerText = match[2]?.trim(); break;
        case 'B': correctAnswerText = match[3]?.trim(); break;
        case 'C': correctAnswerText = match[4]?.trim(); break;
        case 'D': correctAnswerText = match[5]?.trim(); break;
        default: correctAnswerText = '';
      }

      const question = {
        question: match[1]?.trim() || '',
        optionA: match[2]?.trim() || '',
        optionB: match[3]?.trim() || '',
        optionC: match[4]?.trim() || '',
        optionD: match[5]?.trim() || '',
        correctAnswer: correctAnswer || '',
        correctAnswerText: correctAnswerText || '',
        explanation: match[7]?.trim() || '',
      };

      // Validate required fields
      const requiredFields = ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'correctAnswerText', 'explanation'];
      const missingFields = requiredFields.filter(field => !question[field]);
      if (missingFields.length) {
        console.log('Invalid question, missing fields:', missingFields, 'Block:', block);
        continue;
      }

      mcqs.push(question);
    } else {
      console.log('Failed to parse question block:', block);
    }
  }
  console.log('Parsed MCQs:', mcqs);
  return mcqs;
};

// Quiz generation route
// router.post('/generate-quiz', auth, async (req, res) => {
//   try {
//     await rateLimiter.consume(req.ip);

//     const { text, quizCount = 5, userPrompt, title } = req.body;

//     // Validate input
//     if (!text || typeof text !== 'string' || text.trim().length < 50) {
//       throw new APIError('Valid text content (min 50 chars) is required', 400);
//     }
//     const parsedQuizCount = Math.min(Math.max(parseInt(quizCount) || 5, 1), 20);

//     // Clean the extracted text
//     let extractedText;
//     try {
//       extractedText = cleanExtractedText(text);
//       if (!extractedText || extractedText.length < 50) {
//         throw new Error('Insufficient text content after cleaning');
//       }
//     } catch (err) {
//       throw new APIError(
//         'Failed to process text content. Ensure the text is valid and contains sufficient content.',
//         400,
//         { originalLength: text.length }
//       );
//     }

//     // Generate MCQs
//     const responseText = await generateMCQsFromText(extractedText, parsedQuizCount, userPrompt);
//     console.log("OpenAI Response:", responseText);
//     const mcqs = parseMCQs(responseText);

//     if (!mcqs.length) {
//       throw new APIError(
//         'No valid MCQs could be generated. The content may not be suitable for quiz generation.',
//         400,
//         { sampleContent: extractedText.substring(0, 200) }
//       );
//     }

//     // Save quiz to database
//     const quizId = uuidv4();
//     const quiz = new Quiz({
//       quizId,
//       userId: req.userId,
//       title: title || `Generated Quiz - ${new Date().toLocaleDateString()}`,
//       questions: mcqs,
//       sourceText: extractedText.substring(0, 1000),
//       difficulty: 'medium'
//     });

//     await quiz.save();

//     return res.status(201).json({
//       success: true,
//       quizId,
//       title: quiz.title,
//       questions: mcqs,
//       questionCount: mcqs.length,
//       sourceType: 'text'
//     });
//   } catch (error) {
//     const statusCode = error.statusCode || 500;
//     return res.status(statusCode).json({
//       success: false,
//       error: error.message,
//       ...(error.details && { details: error.details }),
//       ...(statusCode === 429 && { retryAfter: rateLimiter.msBeforeNext })
//     });
//   }
// });



// Quiz generation route
router.post('/generate-quiz', auth, async (req, res) => {
  try {
    await rateLimiter.consume(req.ip);

    const { text, quizCount, userPrompt, title } = req.body;

    console.log("extracted texts:", text);

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length < 50) {
      throw new APIError('Valid text content (min 50 chars) is required', 400);
    }

    // Strictly enforce quizCount with default of 5
    let parsedQuizCount;
    if (quizCount === undefined) {
      parsedQuizCount = 5; // Default only if not provided
    } else {
      parsedQuizCount = parseInt(quizCount);
      if (isNaN(parsedQuizCount) || parsedQuizCount < 1 || parsedQuizCount > 20) {
        throw new APIError('Quiz count must be a number between 1 and 20', 400);
      }
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      throw new APIError('Invalid user ID', 401);
    }

    // Check database connection
    if (!mongoose.connection.readyState) {
      throw new APIError('Database connection not established', 500);
    }

    // Clean the extracted text
    let extractedText;
    try {
      extractedText = cleanExtractedText(text);
      if (!extractedText || extractedText.length < 50) {
        throw new Error('Insufficient text content after cleaning');
      }
    } catch (err) {
      throw new APIError(
        'Failed to process text content. Ensure the text is valid and contains sufficient content.',
        400,
        { originalLength: text.length }
      );
    }

    // Generate MCQs
    const responseText = await generateMCQsFromText(extractedText, parsedQuizCount, userPrompt);
    console.log("OpenAI Response:", responseText);
    const mcqs = parseMCQs(responseText);

    if (!mcqs.length) {
      throw new APIError(
        'No valid MCQs could be generated. The content may not be suitable for quiz generation.',
        400,
        { sampleContent: extractedText.substring(0, 200) }
      );
    }

    // Save quiz to database
    const quizId = uuidv4();
    const quiz = new Quiz({
      quizId,
      userId: req.userId,
      title: title || `Generated Quiz - ${new Date().toLocaleDateString()}`,
      questions: mcqs,
      sourceText: extractedText.substring(0, 1000),
      difficulty: 'medium'
    });

    await quiz.save();

    return res.status(201).json({
      success: true,
      quizId,
      title: quiz.title,
      questions: mcqs,
      questionCount: mcqs.length,
      sourceType: 'text'
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      error: error.message,
      ...(error.details && { details: error.details }),
      ...(statusCode === 429 && { retryAfter: rateLimiter.msBeforeNext })
    });
  }
});

// Submit answers
// router.post('/submit-answers', auth, async (req, res) => {
//   try {
//     await rateLimiter.consume(req.ip);
//     const { quizId, answers, duration } = req.body;

//     if (!quizId || !Array.isArray(answers) || !Number.isInteger(Number(duration)) || duration < 0) {
//       throw new APIError('quizId, answers array, and non-negative duration required', 400);
//     }

//     const quiz = await Quiz.findOne({ quizId, userId: req.userId });
//     if (!quiz) {
//       throw new APIError('Quiz not found or unauthorized', 404);
//     }

//     const results = answers.map((answer, index) => {
//       const { questionIndex, selectedAnswer } = answer || {};
//       if (!Number.isInteger(questionIndex) || !selectedAnswer) {
//         return { questionIndex: index, status: 'invalid', message: 'Missing or invalid questionIndex/selectedAnswer' };
//       }
//       if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
//         return { questionIndex, status: 'invalid', message: 'Invalid question index' };
//       }

//       const mcq = quiz.questions[questionIndex];
//       if (!mcq?.question || !mcq?.correctAnswer || !mcq?.correctAnswerText || !mcq?.explanation) {
//         return { questionIndex, status: 'invalid', message: 'Invalid MCQ data' };
//       }

//       const isCorrect = selectedAnswer.toUpperCase() === mcq.correctAnswer;
//       return {
//         questionIndex,
//         question: mcq.question,
//         selectedAnswer: selectedAnswer.toUpperCase(),
//         correctAnswer: mcq.correctAnswer,
//         correctAnswerText: mcq.correctAnswerText,
//         status: isCorrect ? 'correct' : 'incorrect',
//         explanation: isCorrect ? 'Correct answer!' : mcq.explanation,
//       };
//     });

//     const score = results.filter(r => r.status === 'correct').length;
//     const total = answers.length;
//     const difficultyWeights = { easy: 1, medium: 2, hard: 3 };
//     const weightedScore = score * (difficultyWeights[quiz.difficulty || 'medium'] || 2);
//     const scorePercentage = total ? (score / total) * 100 : 0;
//     const level = determineLevel(scorePercentage);
//     const motivationalMessage = getMotivationalMessage(scorePercentage);

//     const quizResult = new QuizResult({
//       quizId,
//       userId: req.userId,
//       score,
//       weightedScore,
//       total,
//       duration,
//       level,
//       motivationalMessage,
//       results,
//       submittedAt: new Date(),
//     });
//     await quizResult.save();

//     return res.status(200).json({
//       quizId,
//       quizTitle: quiz.title || 'Generated Quiz',
//       score,
//       total: quiz.questions.length,
//       duration,
//       level,
//       motivationalMessage,
//       results,
//       submittedAt: quizResult.submittedAt,
//     });
//   } catch (error) {
//     return res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
//   }
// });




// Submit answers
router.post('/submit-answers', auth, async (req, res) => {
  try {
    await rateLimiter.consume(req.ip);
    const { quizId, answers, duration } = req.body;

    // Validate input
    if (!quizId || !Array.isArray(answers) || !Number.isFinite(Number(duration)) || duration < 0) {
      throw new APIError('quizId, answers array, and non-negative duration required', 400);
    }

    // Validate each answer includes timeTaken
    if (answers.some(a => !Number.isFinite(a.timeTaken) || a.timeTaken < 0)) {
      throw new APIError('Each answer must include a valid timeTaken (seconds)', 400);
    }

    const quiz = await Quiz.findOne({ quizId, userId: req.userId });
    if (!quiz) {
      throw new APIError('Quiz not found or unauthorized', 404);
    }

    // Process answers
    const results = answers.map((answer, index) => {
      const { questionIndex, selectedAnswer, timeTaken } = answer || {};
      if (!Number.isInteger(questionIndex) || !selectedAnswer || !Number.isFinite(timeTaken)) {
        return { questionIndex: index, status: 'invalid', message: 'Missing or invalid questionIndex/selectedAnswer/timeTaken' };
      }
      if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
        return { questionIndex, status: 'invalid', message: 'Invalid question index' };
      }

      const mcq = quiz.questions[questionIndex];
      if (!mcq?.question || !mcq?.correctAnswer || !mcq?.correctAnswerText || !mcq?.explanation) {
        return { questionIndex, status: 'invalid', message: 'Invalid MCQ data' };
      }

      const isCorrect = selectedAnswer.toUpperCase() === mcq.correctAnswer;
      return {
        questionIndex,
        question: mcq.question,
        selectedAnswer: selectedAnswer.toUpperCase(),
        correctAnswer: mcq.correctAnswer,
        correctAnswerText: mcq.correctAnswerText,
        status: isCorrect ? 'correct' : 'incorrect',
        explanation: isCorrect ? 'Correct answer!' : mcq.explanation,
        timeTaken, // Include for analytics and feedback
      };
    });

    // Calculate performance metrics
    const score = results.filter(r => r.status === 'correct').length;
    const total = answers.length;
    const scorePercentage = total ? (score / total) * 100 : 0;
    const avgAnswerTime = answers.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / answers.length || 0;
    const difficultyWeights = { easy: 1, medium: 2, hard: 3 };
    const weightedScore = score * (difficultyWeights[quiz.difficulty || 'medium'] || 2);
    const level = determineLevel(scorePercentage);

    // Generate AI-powered motivational message
    const motivationalMessage = await getMotivationalMessage(scorePercentage, avgAnswerTime);

    // Save quiz result
    const quizResult = new QuizResult({
      quizId,
      userId: req.userId,
      score,
      weightedScore,
      total,
      duration,
      level,
      motivationalMessage,
      results,
      submittedAt: new Date(),
    });
    await quizResult.save();

    return res.status(200).json({
      quizId,
      quizTitle: quiz.title || 'Generated Quiz',
      score,
      total: quiz.questions.length,
      duration,
      level,
      motivationalMessage,
      results,
      submittedAt: quizResult.submittedAt,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Internal server error',
      ...(error.statusCode === 429 && { retryAfter: rateLimiter.msBeforeNext }),
    });
  }
});

// Quiz history
router.get('/quiz-history', auth, async (req, res) => {
  try {
    const quizResults = await QuizResult.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: 'quizId',
          foreignField: 'quizId',
          as: 'quizData',
        },
      },
      {
        $unwind: {
          path: '$quizData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          quizId: 1,
          quizTitle: { $ifNull: ['$quizData.title', 'Untitled Quiz'] },
          score: 1,
          total: 1,
          duration: 1,
          level: 1,
          motivationalMessage: 1,
          results: 1,
          submittedAt: 1,
        },
      },
      {
        $sort: { submittedAt: -1 },
      },
    ]);

    return res.status(200).json({ quizResults });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
  }
});

// Leaderboard with difficulty weighting
router.get('/leaderboard', auth, async (req, res) => {
  try {
    await rateLimiter.consume(req.ip);
    const limit = parseInt(req.query.limit) || 10;
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new APIError('Limit must be an integer between 1 and 100', 400);
    }

    const levelWeights = { Advanced: 4, Intermediate: 3, Beginner: 2, Novice: 1 };
    const leaderboard = await QuizResult.aggregate([
      {
        $group: {
          _id: '$userId',
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: '$weightedScore' },
          totalQuestions: { $sum: '$total' },
          averageDuration: { $avg: '$duration' },
          levels: { $push: '$level' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          totalQuizzes: 1,
          averageScorePercentage: {
            $round: [
              { $cond: [{ $eq: ['$totalQuestions', 0] }, 0, { $multiply: [{ $divide: ['$totalScore', '$totalQuestions'] }, 100] }] },
              2,
            ],
          },
          averageDuration: { $round: ['$averageDuration', 2] },
          highestLevel: {
            $reduce: {
              input: '$levels',
              initialValue: 'Novice',
              in: {
                $cond: [
                  { $gt: [{ $ifNull: [levelWeights['$$this'], 0] }, { $ifNull: [levelWeights['$$value'], 0] }] },
                  '$$this',
                  '$$value',
                ],
              },
            },
          },
        },
      },
      { $sort: { averageScorePercentage: -1, totalQuizzes: -1 } },
      { $limit: limit },
      {
        $setWindowFields: {
          sortBy: { averageScorePercentage: -1 },
          output: { rank: { $rank: {} } },
        },
      },
    ]);

    return res.status(200).json({ leaderboard });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
  }
});

// Retrieve quiz
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      throw new APIError('Quiz ID required', 400);
    }

    const quiz = await Quiz.findOne({ quizId, userId: req.userId });
    if (!quiz) {
      throw new APIError('Quiz not found or unauthorized', 404);
    }

    return res.status(200).json({
      quizId: quiz.quizId,
      title: quiz.title,
      response: quiz.questions,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
  }
});

// Delete quiz
router.delete('/quiz-history/:quizId', auth, async (req, res) => {
  try {
    const { quizId } = req.params;

    if (!quizId) {
      throw new APIError('Quiz ID required', 400);
    }

    const result = await QuizResult.findOneAndDelete({ quizId, userId: req.userId });

    if (!result) {
      return res.status(404).json({
        error: 'No quiz found or Unauthorized',
      });
    }

    return res.status(200).json({
      message: 'Quiz Deleted Successfully!',
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;