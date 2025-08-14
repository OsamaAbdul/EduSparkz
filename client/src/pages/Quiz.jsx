import { useState, useEffect } from "react";
import { QuizCard } from "../components/dasboard/QuizCard";
import { useUser } from "../context/useContext.jsx";
import { useNavigate } from "react-router-dom";

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

        if (!quizId) {
          throw new Error("No quiz ID provided");
        }

        const API_BASE_URL = "http://localhost:5000";
        const token = user.token || localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch(`${API_BASE_URL}/api/user/quiz/${quizId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            navigate("/api/auth/login");
            return;
          }
          throw new Error(errorData.error || `Failed to fetch quiz: ${response.statusText}`);
        }

        const data = await response.json();
        const transformedQuiz = {
          quizId: data.quizId,
          title: quizTitle || data.title || "Generated Quiz",
          duration: data.duration || 300,
          questions: data.response.map((mcq) => ({
            question: mcq.question,
            options: [mcq.optionA, mcq.optionB, mcq.optionC, mcq.optionD],
          })),
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
  }, [quizId, quizTitle, user.token, navigate]);

  const handleSubmit = async (submissionData) => {
    try {
      setLoading(true);
      setError(null);

      // const API_BASE_URL = "http://localhost:5000";
      const token = user.token || localStorage.getItem("authToken");
      if (!token) {
        navigate("/api/auth/login");
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/submit-answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId: quiz.quizId,
          answers: submissionData.answers,
          duration: submissionData.duration,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          navigate("/api/auth/login");
          return;
        }
        throw new Error(errorData.error || `Failed to submit quiz: ${response.statusText}`);
      }

      const result = await response.json();
      // Include quizId and quizTitle in results
      localStorage.setItem(
        "quizResult",
        JSON.stringify({
          ...result,
          quizId: quiz.quizId,
          quizTitle: quiz.title,
        })
      );
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Getting quiz Result...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Error: {error}
          <button
            onClick={handleCancel}
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">No quiz data available</div>
      </div>
    );
  }

  return <QuizCard quiz={quiz} onSubmit={handleSubmit} onCancel={handleCancel} />;
};

export default Quiz;