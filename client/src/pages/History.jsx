import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, RotateCcw, Trash2 } from "lucide-react";
import { useUser } from "../context/useContext.jsx";
import { toast } from "sonner";
import { DashboardLayout } from "../components/dasboard/DashboardLayout.jsx";

// Custom CSS for spinner (inherited from FileUploadCard)
const spinnerStyles = `
  .custom-spinner {
    width: 32px;
    height: 32px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #a855f7; /* Matches purple-400 */
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const History = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const itemsPerPage = 5;

  const [loadingText, setLoadingText] = useState("Fetching quiz history...");

  useEffect(() => {
    if (!user?.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["quizHistory", user?.token, currentPage],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/quiz-history`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("this is the response:", response);
      if (!response.ok) {
        if (response.status === 401) navigate("/login");
        throw new Error("Failed to fetch quiz history");
      }
      return response.json();
    },
    enabled: !!user?.token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (quizId) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/user/quiz-history/${quizId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!response.ok) {
        if (response.status === 401) navigate("/login");
        throw new Error("Failed to delete quiz result");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Quiz result deleted successfully");
      queryClient.invalidateQueries(["quizHistory", user?.token, currentPage]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete quiz result");
    },
  });

  useEffect(() => {
    if (isLoading) {
      const texts = ["Fetching quiz history...", "Processing...", "Loading..."];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[index]);
        index = (index + 1) % texts.length;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Lagos",
    });
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-blue-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const handleRetakeQuiz = (quizId, quizTitle) => {
    console.log("Retaking quiz:", { quizId, quizTitle }); // Debug retake
    toast.success(`Retaking "${quizTitle || "Untitled Quiz"}"...`);
    navigate("/user/dashboard", {
      state: { retakeQuizId: quizId, retakeQuizTitle: quizTitle || "Retake Quiz" },
    });
  };

  const handleViewDetails = (result) => {
    console.log("Viewing quiz result:", result); // Debug view details
    localStorage.setItem("quizResult", JSON.stringify(result));
    navigate("/user/quiz-results");
  };

  const handleDeleteQuiz = (quizId, quizTitle) => {
    console.log("Deleting quiz:", { quizId, quizTitle }); // Debug delete
    if (window.confirm(`Are you sure you want to delete "${quizTitle || "Untitled Quiz"}"?`)) {
      deleteMutation.mutate(quizId);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load quiz history");
    }
  }, [error]);

  const quizResults = data?.quizResults || [];
  console.log("data gotten:", data);
  const totalPages = Math.ceil(quizResults.length / itemsPerPage);
  const paginatedResults = quizResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log("Paginated results:", paginatedResults); // Debug paginated results

  return (
    <DashboardLayout>
      <style>{spinnerStyles}</style>
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-full space-y-2">
              <div className="custom-spinner" />
              <span className="text-white">{loadingText}</span>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center min-h-full">
              <div className="text-white text-xl flex flex-col items-center gap-4">
                <p>Error: {error.message}</p>
                <Button
                  onClick={() => refetch()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Retry
                </Button>
                <Button
                  onClick={() => navigate("/user/dashboard")}
                  variant="outline"
                  className="bg-transparent border-purple-500 text-purple-300 "
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          ) : quizResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full space-y-4">
              <div className="text-white text-xl">No quiz history available</div>
              <Button
                onClick={() => navigate("/user/dashboard")}
                variant="outline"
                className="bg-transparent border-purple-500 text-purple-300"
              >
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-4 pt-8">
                <h1 className="text-4xl font-bold text-white mb-2">Quiz History</h1>
                <p className="text-purple-300">Review, retake, or delete your past quiz attempts!</p>
              </div>

              <Card className="bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="text-yellow-400" />
                    Past Quizzes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paginatedResults.map((result) => {
                    console.log("Result:", result);
                    const percentage = (result.score / result.total) * 100;
                    return (
                      <div
                        key={result.quizId}
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <div className={`text-lg font-bold ${getScoreColor(percentage)}`}>
                              {result.score}/{result.total} ({percentage.toFixed(1)}%)
                            </div>
                            <div className="text-purple-300 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {formatTime(result.duration)}
                            </div>
                            <div className="text-purple-300">{result.level}</div>
                            <div className="text-purple-300">{result.quizTitle}</div>
                            <div className="text-gray-400 text-sm">{formatDate(result.submittedAt)}</div>
                            <div className="text-purple-300">{result.motivationalMessage}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleRetakeQuiz(result.quizId, result.quizTitle)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Retake
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuiz(result.quizId, result.quizTitle)}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pb-8">
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
                  >
                    Previous
                  </Button>
                  <span className="text-white self-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
                  >
                    Next
                  </Button>
                </div>
              )}

              <div className="flex justify-center pb-8">
                <Button
                  onClick={() => navigate("/user/dashboard")}
                  variant="outline"
                  className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default History;