import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, RotateCcw, Trash2 } from "lucide-react";
import { useUser } from "../context/useContext.jsx";
import { toast } from "sonner";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Sidebar } from "../layouts/Sidebar.jsx";
import Header from "../layouts/Header.jsx";
import { supabase } from "../lib/supabase";

const spinnerStyles = `
  .custom-spinner {
    width: 32px;
    height: 32px;
    border: 4px solid rgba(172, 189, 170, 0.2);
    border-top: 4px solid #ACBDAA;
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
  const itemsPerPage = 5;
  const [loadingText, setLoadingText] = useState("Fetching quiz history...");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLaptop = useMediaQuery({ minWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    setSidebarOpen(isLaptop);
  }, [isLaptop]);

  useEffect(() => {
    if (!user?.token) navigate("/api/auth/login");
  }, [user, navigate]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["quizHistory", user?.token, currentPage],
    queryFn: async () => {
      const { data: quizResults, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          quizzes (
            title
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      const transformedResults = quizResults.map(result => ({
        quizId: result.quiz_id,
        quizTitle: result.quizzes?.title || 'Untitled Quiz',
        score: result.score,
        total: result.total,
        duration: result.duration,
        level: result.level,
        motivationalMessage: result.motivational_message,
        results: result.results,
        submittedAt: result.submitted_at,
      }));

      return { quizResults: transformedResults };
    },
    enabled: !!user?.token,
  });

  const deleteMutation = useMutation({
    mutationFn: async (quizId) => {
      const { error } = await supabase
        .from('quiz_results')
        .delete()
        .eq('quiz_id', quizId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Quiz result deleted successfully");
      queryClient.invalidateQueries(["quizHistory", user?.token, currentPage]);
    },
    onError: (error) => toast.error(error.message || "Failed to delete quiz result"),
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

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }) : "N/A";

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-[#ACBDAA] dark:text-[#ACBDAA]";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleRetakeQuiz = (quizId, quizTitle) => {
    toast.success(`Retaking "${quizTitle || "Untitled Quiz"}"...`);
    navigate("/user/dashboard", { state: { retakeQuizId: quizId, retakeQuizTitle: quizTitle || "Retake Quiz" } });
  };

  const handleDeleteQuiz = (quizId, quizTitle) => {
    if (window.confirm(`Are you sure you want to delete "${quizTitle || "Untitled Quiz"}"?`)) {
      deleteMutation.mutate(quizId);
    }
  };

  const quizResults = data?.quizResults || [];
  const totalPages = Math.ceil(quizResults.length / itemsPerPage);
  const paginatedResults = quizResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DashboardLayout>
      <style>{spinnerStyles}</style>
      <div className="relative flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300 w-full">
        {/* Background Accent */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ACBDAA]/10 via-transparent to-transparent dark:from-[#ACBDAA]/10" />

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ x: isLaptop ? 0 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLaptop ? 0 : -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className={`fixed lg:sticky top-0 left-0 z-50 lg:z-40 h-screen 
                bg-white/80 dark:bg-[#1E2D4C]/70 border-r border-[#ACBDAA]/20 backdrop-blur-xl 
                overflow-hidden lg:overflow-visible w-64`}
            >
              <Sidebar
                isOpen={sidebarOpen}
                iconOnly={!sidebarOpen && isLaptop}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          key="main"
          layout
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        >
          {/* Header */}
          <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/70 border-b border-[#ACBDAA]/20 transition-colors duration-300 flex items-center justify-center px-0 sm:px-6 py-0">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} className="w-full" />
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-2">
                <div className="custom-spinner" />
                <span className="text-[#1E2D4C] dark:text-[#ACBDAA]">{loadingText}</span>
              </div>
            ) : quizResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl">No quiz history available</div>
                <Button
                  onClick={() => navigate("/user/dashboard")}
                  variant="outline"
                  className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/80 hover:bg-[#ACBDAA]/10"
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center space-y-2 pt-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA] mb-2">Quiz History</h1>
                  <p className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70">Review, retake, or delete your past quiz attempts!</p>
                </div>

                <Card className="bg-white/70 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 backdrop-blur-sm shadow-lg shadow-[#ACBDAA]/10 dark:shadow-[#ACBDAA]/20">
                  <CardHeader>
                    <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] flex items-center gap-2">
                      <Trophy className="text-yellow-500 dark:text-yellow-400" />
                      Past Quizzes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paginatedResults.map((result) => {
                      const percentage = (result.score / result.total) * 100;
                      return (
                        <div key={result.quizId} className="p-4 bg-white/50 dark:bg-[#1E2D4C]/40 rounded-lg border border-[#ACBDAA]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-[#ACBDAA]/5">
                          <div className="flex flex-col gap-2 w-full sm:w-auto">
                            <div className={`text-lg font-bold ${getScoreColor(percentage)}`}>
                              {result.score}/{result.total} ({percentage.toFixed(1)}%)
                            </div>
                            <div className="text-[#1E2D4C]/80 dark:text-[#ACBDAA]/80 flex items-center gap-2">
                              <Clock className="w-4 h-4" />{formatTime(result.duration)}
                            </div>
                            <div className="text-[#1E2D4C]/80 dark:text-[#ACBDAA]/80 font-medium">{result.level}</div>
                            <div className="text-[#1E2D4C] dark:text-[#ACBDAA] font-semibold">{result.quizTitle}</div>
                            <div className="text-[#1E2D4C]/50 dark:text-[#ACBDAA]/50 text-sm">{formatDate(result.submittedAt)}</div>
                            <div className="text-[#1E2D4C]/80 dark:text-[#ACBDAA]/80 italic text-sm">"{result.motivationalMessage}"</div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <Button
                              onClick={() => handleRetakeQuiz(result.quizId, result.quizTitle)}
                              className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/80 flex-1 sm:flex-none"
                            >
                              <RotateCcw className="mr-2 h-4 w-4" /> Retake
                            </Button>
                            <Button
                              onClick={() => handleDeleteQuiz(result.quizId, result.quizTitle)}
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-none"
                              disabled={deleteMutation.isLoading}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/70 hover:bg-[#ACBDAA]/10"
                    >
                      Previous
                    </Button>
                    <span className="text-[#1E2D4C] dark:text-[#ACBDAA] self-center">Page {currentPage} of {totalPages}</span>
                    <Button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/70 hover:bg-[#ACBDAA]/10"
                    >
                      Next
                    </Button>
                  </div>
                )}

                <div className="flex justify-center pb-8">
                  <Button
                    onClick={() => navigate("/user/dashboard")}
                    variant="outline"
                    className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/70 hover:bg-[#ACBDAA]/10"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </main>
        </motion.div>

        {/* Mobile Overlay */}
        <AnimatePresence>
          {!isLaptop && sidebarOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default History;
