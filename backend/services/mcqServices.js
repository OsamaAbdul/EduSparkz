import shuffleArray from '../utils/shuffleArray.js';

export const parseMCQs = (text) => {
  const questions = [];
  const questionBlocks = text.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
  for (const block of questionBlocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);
    if (lines.length < 7) {
      console.log('Skipping invalid block (too few lines):', block);
      continue;
    }
    const question = {};
    let options = [];
    for (const line of lines) {
      if (line.match(/^question:\s*/i)) question.question = line.replace(/^question:\s*/i, '');
      else if (line.match(/^A:\s*/i)) options[0] = { label: 'A', text: line.replace(/^A:\s*/i, '') };
      else if (line.match(/^B:\s*/i)) options[1] = { label: 'B', text: line.replace(/^B:\s*/i, '') };
      else if (line.match(/^C:\s*/i)) options[2] = { label: 'C', text: line.replace(/^C:\s*/i, '') };
      else if (line.match(/^D:\s*/i)) options[3] = { label: 'D', text: line.replace(/^D:\s*/i, '') };
      else if (line.match(/^correctAnswer:\s*/i)) question.correctAnswer = line.replace(/^correctAnswer:\s*/i, '');
      else if (line.match(/^correctAnswerText:\s*/i)) question.correctAnswerText = line.replace(/^correctAnswerText:\s*/i, '');
      else if (line.match(/^explanation:\s*/i)) question.explanation = line.replace(/^explanation:\s*/i, '');
    }
    if (options.length === 4 && question.correctAnswer && question.correctAnswerText && question.explanation && question.question) {
      options = shuffleArray(options);
      const correctOption = options.find((opt) => opt.text === question.correctAnswerText);
      if (!correctOption) {
        console.log('Skipping question: correctAnswerText does not match any option:', question);
        continue;
      }
      question.correctAnswer = correctOption.label;
      question.optionA = options[0].text;
      question.optionB = options[1].text;
      question.optionC = options[2].text;
      question.optionD = options[3].text;
      questions.push(question);
    } else {
      console.log('Skipping invalid question block:', block);
    }
  }
  console.log('Parsed MCQs count:', questions.length);
  return shuffleArray(questions);
};