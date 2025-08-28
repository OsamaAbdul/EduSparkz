import openai from '../config/openai.js';




import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY, // Use environment variable for security
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000', // Your site URL
    'X-Title': process.env.SITE_NAME || 'Quiz App', // Your site name
  },
});

export default openai;