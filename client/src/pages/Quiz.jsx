// import { useState, useEffect } from "react";
// import { QuizCard } from "../components/dashboard/QuizCard";
// import { useUser } from "../context/useContext.jsx";
// import { useNavigate } from "react-router-dom";

// const Quiz = ({ quizId, quizTitle, onComplete }) => {
//   const [quiz, setQuiz] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (!quizId) {
//           throw new Error("No quiz ID provided");
//         }


//         const token = user.token || localStorage.getItem("authToken");
//         if (!token) {
//           throw new Error("No authentication token found. Please log in.");
//         }

//         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/quiz/${quizId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           if (response.status === 401) {
//             navigate("/api/auth/login");
//             return;
//           }
//           throw new Error(errorData.error || `Failed to fetch quiz: ${response.statusText}`);
//         }

//         const data = await response.json();
//         const transformedQuiz = {
//           quizId: data.quizId,
//           title: quizTitle || data.title || "Generated Quiz",
//           duration: data.duration || 300,
//           questions: data.response.map((mcq) => ({
//             question: mcq.question,
//             options: [mcq.optionA, mcq.optionB, mcq.optionC, mcq.optionD],
//           })),
//         };

//         setQuiz(transformedQuiz);
//       } catch (err) {
//         console.error("Error fetching quiz:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuiz();
//   }, [quizId, quizTitle, user.token, navigate]);

//   const handleSubmit = async (submissionData) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // const API_BASE_URL = "http://localhost:5000";
//       const token = user.token || localStorage.getItem("authToken");
//       if (!token) {
//         navigate("/api/auth/login");
//         throw new Error("No authentication token found. Please log in.");
//       }

//       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/submit-answers`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           quizId: quiz.quizId,
//           answers: submissionData.answers,
//           duration: submissionData.duration,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           navigate("/api/auth/login");
//           return;
//         }
//         throw new Error(errorData.error || `Failed to submit quiz: ${response.statusText}`);
//       }

//       const result = await response.json();
//       // Include quizId and quizTitle in results
//       localStorage.setItem(
//         "quizResult",
//         JSON.stringify({
//           ...result,
//           quizId: quiz.quizId,
//           quizTitle: quiz.title,
//         })
//       );
//       navigate("/user/quiz-result");
//       onComplete(); 
//       return result;
//     } catch (err) {
//       console.error("Error submitting quiz:", err);
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     onComplete(); 
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Getting quiz Result...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">
//           Error: {error}
//           <button
//             onClick={handleCancel}
//             className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
//           >
//             Back to Upload
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!quiz) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">No quiz data available</div>
//       </div>
//     );
//   }

//   return <QuizCard quiz={quiz} onSubmit={handleSubmit} onCancel={handleCancel} />;
// };

// export default Quiz;



import { useState, useEffect } from "react";
import { QuizCard } from "../features/quiz/components/QuizCard";
import { useUser } from "../context/useContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const Quiz = ({ quizId, quizTitle, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!quizId) throw new Error("No quiz ID provided");

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error("Unauthorized");

        // Fetch current quiz
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Quiz not found");

        let questions = data.questions.map((mcq) => ({
          question: mcq.question,
          options: [mcq.optionA, mcq.optionB, mcq.optionC, mcq.optionD],
          correctAnswer: mcq.correctAnswer,
          correctAnswerText: mcq.correctAnswerText,
          explanation: mcq.explanation,
          isRetention: false
        }));

        // Fetch retention questions
        const { data: retentionData, error: retentionError } = await supabase
          .rpc('get_retention_questions', { p_user_id: authUser.id });

        if (!retentionError && retentionData && retentionData.length > 0) {
          const retentionQuestions = retentionData.map(rq => ({
            question: `[Retention Check: ${rq.quiz_title}] ${rq.question}`,
            options: [rq.optionA, rq.optionB, rq.optionC, rq.optionD],
            correctAnswer: rq.correctAnswer,
            correctAnswerText: rq.correctAnswerText,
            explanation: rq.explanation,
            isRetention: true,
            sourceQuizId: rq.quiz_id,
            sourceQuizTitle: rq.quiz_title
          }));

          // Inject retention questions at random positions (avoiding first/last if possible)
          retentionQuestions.forEach(rq => {
            const insertIndex = Math.floor(Math.random() * (questions.length - 1)) + 1;
            questions.splice(insertIndex, 0, rq);
          });
        }

        const transformedQuiz = {
          quizId: data.id,
          title: quizTitle || data.title || "Generated Quiz",
          duration: questions.length * 60,
          questions: questions,
        };

        setQuiz(transformedQuiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, quizTitle, navigate]);

  const handleSubmit = async (submissionData) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      // Calculate score locally
      const results = submissionData.answers.map((answer, index) => {
        const mcq = quiz.questions[index];
        const isCorrect = answer.selectedAnswer.toUpperCase() === mcq.correctAnswer;
        return {
          questionIndex: index,
          question: mcq.question,
          selectedAnswer: answer.selectedAnswer.toUpperCase(),
          correctAnswer: mcq.correctAnswer,
          correctAnswerText: mcq.correctAnswerText,
          status: isCorrect ? 'correct' : 'incorrect',
          explanation: isCorrect ? 'Correct answer!' : mcq.explanation,
          timeTaken: answer.timeTaken || 0,
          isRetention: mcq.isRetention,
          sourceQuizId: mcq.sourceQuizId,
          sourceQuizTitle: mcq.sourceQuizTitle
        };
      });

      // Check for retention failure
      const failedRetention = results.find(r => r.isRetention && r.status === 'incorrect');
      if (failedRetention) {
        alert(`Retention Check Failed! You seem to have forgotten concepts from "${failedRetention.sourceQuizTitle}". You must retake that quiz now.`);
        navigate('/user/dashboard', {
          state: {
            retakeQuizId: failedRetention.sourceQuizId,
            retakeQuizTitle: failedRetention.sourceQuizTitle
          }
        });
        return; // Stop submission
      }

      const score = results.filter(r => r.status === 'correct').length;
      const total = results.length;
      const scorePercentage = total ? (score / total) * 100 : 0;
      const avgTimePerQuestion = total ? submissionData.duration / total : 0;

      // Determine level
      let level = 'Novice';
      if (scorePercentage >= 90) level = 'Advanced';
      else if (scorePercentage >= 70) level = 'Intermediate';
      else if (scorePercentage >= 50) level = 'Beginner';

      // Generate Motivational Message via AI
      let motivationalMessage = "";
      try {
        const { data: feedbackData, error: feedbackError } = await supabase.functions.invoke('generate-feedback', {
          body: { score, total, avgTimePerQuestion }
        });

        if (feedbackError) throw feedbackError;
        motivationalMessage = feedbackData.message;
      } catch (err) {
        console.error("Failed to generate AI feedback:", err);
        // Fallback logic if AI fails
        if (scorePercentage >= 70) {
          motivationalMessage = "Omo you try well well! (AI sleep, but you do well)";
        } else {
          motivationalMessage = "No wahala, try again! (AI sleep, but we dey with you)";
        }
      }

      const { data: resultData, error: resultError } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quiz.quizId,
          user_id: user.id,
          score,
          total,
          duration: submissionData.duration,
          level,
          motivational_message: motivationalMessage,
          results
        })
        .select()
        .single();

      if (resultError) throw resultError;

      const result = {
        quizId: quiz.quizId,
        quizTitle: quiz.title,
        score,
        total,
        duration: submissionData.duration,
        level,
        motivationalMessage,
        results,
        submittedAt: resultData.submitted_at,
      };

      localStorage.setItem("quizResult", JSON.stringify(result));
      navigate("/user/quiz-result");
      onComplete();
      return result;
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onComplete();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1E2D4C]">
        <div className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl">Getting quiz Result...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1E2D4C]">
        <div className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl flex flex-col items-center gap-4">
          <span>Error: {error}</span>
          <button
            onClick={handleCancel}
            className="ml-4 bg-[#ACBDAA] text-[#1E2D4C] px-4 py-2 rounded-lg hover:bg-[#ACBDAA]/80"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1E2D4C]">
        <div className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl">No quiz data available</div>
      </div>
    );
  }

  return <QuizCard quiz={quiz} onSubmit={handleSubmit} onCancel={handleCancel} />;
};

export default Quiz;
