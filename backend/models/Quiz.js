// models/Quiz.js
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  optionA: { type: String, required: true },
  optionB: { type: String, required: true },
  optionC: { type: String, required: true },
  optionD: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  correctAnswerText: { type: String, required: true },
  explanation: { type: String, required: true },
});

const QuizSchema = new mongoose.Schema({
  quizId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  duration: { type: Number, required: true }, // Duration in seconds
  level: { type: String, required: true },
  motivationalMessage: { type: String, required: true },
  results: [
    {
      questionIndex: { type: Number, required: true },
      question: { type: String, required: true },
      selectedAnswer: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      correctAnswerText: { type: String, required: true },
      status: { type: String, enum: ['correct', 'incorrect', 'invalid'], required: true },
      explanation: { type: String, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

export const Quiz = mongoose.model('Quiz', QuizSchema);
export const QuizResult = mongoose.model('QuizResult', QuizResultSchema);