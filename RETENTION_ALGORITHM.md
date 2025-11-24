# EduSparkz - Retention Algorithm Documentation

## Overview

The EduSparkz retention algorithm is an intelligent spaced-repetition system designed to reinforce learning by periodically testing students on material they previously struggled with. This ensures long-term retention and prevents knowledge decay.

## How It Works

### 1. **Tracking Failed Quizzes**

When a student completes a quiz, the system:
- Calculates their score percentage
- Marks quizzes with a score below 70% as "failed"
- Stores all quiz results in the `quiz_results` table with associated quiz data

### 2. **Injection of Retention Questions**

When a student starts a new quiz (Material B), the system:
- Calls the `get_retention_questions` RPC function
- Retrieves 2 random questions from previously failed quizzes (Material A)
- Injects these questions at random positions within the new quiz
- Marks these questions with `isRetention: true` flag

### 3. **Retention Check During Quiz**

As the student takes the quiz:
- Retention questions are clearly labeled with `[Retention Check: Quiz Title]` prefix
- The student must answer all questions, including retention checks
- The system tracks which questions are retention questions

### 4. **Forced Retake Mechanism**

Upon quiz submission:
- The system checks if any retention questions were answered incorrectly
- If a retention question fails:
  - An alert notifies the student they've forgotten concepts from the source quiz
  - The student is immediately redirected to retake the failed quiz
  - The current quiz (Material B) is NOT saved
  - The student must complete the failed quiz before resuming

### 5. **Successful Completion**

If all retention questions are answered correctly:
- The quiz is submitted normally
- Results are saved to the database
- The student can proceed to the next quiz

## Database Schema

### RPC Function: `get_retention_questions`

```sql
create or replace function get_retention_questions(p_user_id uuid)
returns table (
  question text,
  "optionA" text,
  "optionB" text,
  "optionC" text,
  "optionD" text,
  "correctAnswer" text,
  "correctAnswerText" text,
  explanation text,
  quiz_id uuid,
  quiz_title text
)
```

**Logic:**
1. Finds the latest attempt for each quiz by the user
2. Filters quizzes where score < 70% (failed threshold)
3. Extracts individual questions from failed quizzes
4. Returns 2 random questions

## Implementation Details

### Frontend (Quiz.jsx)

**Fetching Quiz with Retention:**
```javascript
// Fetch current quiz
const { data, error } = await supabase
  .from('quizzes')
  .select('*')
  .eq('id', quizId)
  .single();

// Fetch retention questions
const { data: retentionData } = await supabase
  .rpc('get_retention_questions', { p_user_id: authUser.id });

// Inject retention questions
if (retentionData && retentionData.length > 0) {
  const retentionQuestions = retentionData.map(rq => ({
    question: `[Retention Check: ${rq.quiz_title}] ${rq.question}`,
    options: [rq.optionA, rq.optionB, rq.optionC, rq.optionD],
    correctAnswer: rq.correctAnswer,
    isRetention: true,
    sourceQuizId: rq.quiz_id,
    sourceQuizTitle: rq.quiz_title
  }));

  // Insert at random positions
  retentionQuestions.forEach(rq => {
    const insertIndex = Math.floor(Math.random() * (questions.length - 1)) + 1;
    questions.splice(insertIndex, 0, rq);
  });
}
```

**Handling Submission:**
```javascript
// Check for retention failure
const failedRetention = results.find(r => r.isRetention && r.status === 'incorrect');

if (failedRetention) {
  alert(`Retention Check Failed! You must retake "${failedRetention.sourceQuizTitle}".`);
  navigate('/user/dashboard', { 
    state: { 
      retakeQuizId: failedRetention.sourceQuizId, 
      retakeQuizTitle: failedRetention.sourceQuizTitle 
    } 
  });
  return; // Stop submission
}
```

## Configuration

### Failure Threshold
- **Current:** 70% (score/total < 0.7)
- **Location:** `supabase/schema.sql` line 169
- **Adjustable:** Change the threshold in the SQL function

### Number of Retention Questions
- **Current:** 2 questions per quiz
- **Location:** `supabase/schema.sql` line 190 (`limit 2`)
- **Adjustable:** Modify the LIMIT clause

### Injection Position
- **Current:** Random position (avoiding first/last when possible)
- **Location:** `client/src/pages/Quiz.jsx` lines 222-225
- **Adjustable:** Modify the `insertIndex` calculation

## Benefits

1. **Spaced Repetition:** Reinforces learning at optimal intervals
2. **Targeted Review:** Focuses on weak areas rather than all material
3. **Forced Mastery:** Ensures students can't progress without understanding
4. **Seamless Integration:** Retention checks blend naturally into new quizzes
5. **Data-Driven:** Uses actual performance data to determine what needs review

## User Experience Flow

```
Student starts Quiz B
    ↓
System checks for failed quizzes (Quiz A)
    ↓
Injects 2 questions from Quiz A into Quiz B
    ↓
Student takes Quiz B (including retention questions)
    ↓
Student submits Quiz B
    ↓
Did student fail retention questions?
    ├─ YES → Redirect to retake Quiz A (Quiz B not saved)
    └─ NO  → Save Quiz B results, proceed normally
```

## Future Enhancements

1. **Adaptive Difficulty:** Adjust number of retention questions based on overall performance
2. **Time-Based Triggers:** Inject retention questions based on time elapsed since last attempt
3. **Progressive Difficulty:** Start with easier retention questions, gradually increase difficulty
4. **Analytics Dashboard:** Show students which topics need more review
5. **Customizable Thresholds:** Allow instructors to set failure thresholds per quiz

## Technical Notes

- Retention questions are stored in memory during quiz session
- No additional database tables required
- Minimal performance impact (single RPC call)
- Compatible with existing quiz infrastructure
- Works seamlessly with the Supabase serverless architecture
