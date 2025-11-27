import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trophy, RotateCcw, Trash2, Calendar } from "lucide-react";
import { useUser } from "../context/useContext.jsx";
import { toast } from "sonner";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { supabase } from "../lib/supabase";

const History = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingText, setLoadingText] = useState("Fetching quiz history...");

  useEffect(() => {
    if (!user?.token) navigate("/api/auth/login");
  }, [user, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["quizHistory", user?.token, currentPage],
    queryFn: async () => {
      const { data: quizResults, error } = await supabase
        .from('quiz_results')
        .select(`*, quizzes (title)`)
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

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A";

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-electric-lime";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-500";
  };

  const handleRetakeQuiz = (quizId, quizTitle) => {
    toast.success(`Retaking "${quizTitle || "Untitled Quiz"}"...`);
    navigate("/user/start-quiz", { state: { retakeQuizId: quizId, retakeQuizTitle: quizTitle || "Retake Quiz" } });
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
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz History</h1>
            <p className="text-gray-400">Review, retake, or delete your past quiz attempts!</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-cyan"></div>
            <span className="text-gray-400">{loadingText}</span>
          </div>
        ) : quizResults.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No quiz history available</h3>
            <Button
              onClick={() => navigate("/user/dashboard")}
              className="mt-4 bg-white/10 hover:bg-white/20 text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <Card className="glass-card border-white/10 p-6 rounded-3xl">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Trophy className="text-yellow-500" />
                Past Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <AnimatePresence>
                {paginatedResults.map((result, index) => {
                  const percentage = (result.score / result.total) * 100;
                  return (
                    <motion.div
                      key={result.quizId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-electric-cyan/30 transition-all group"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white group-hover:text-electric-cyan transition-colors">
                              {result.quizTitle}
                            </h3>
                            <span className={`text-xl font-bold ${getScoreColor(percentage)}`}>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(result.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(result.submittedAt)}
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-white/10 text-xs border border-white/10">
                              {result.level}
                            </div>
                          </div>

                          <p className="text-gray-500 italic text-sm border-l-2 border-white/10 pl-3">
                            "{result.motivationalMessage}"
                          </p>
                        </div>

                        <div className="flex items-center gap-3 lg:flex-col lg:justify-center">
                          <Button
                            onClick={() => handleRetakeQuiz(result.quizId, result.quizTitle)}
                            className="flex-1 lg:w-full bg-electric-cyan/10 text-electric-cyan hover:bg-electric-cyan/20 border border-electric-cyan/20"
                          >
                            <RotateCcw className="mr-2 h-4 w-4" /> Retake
                          </Button>
                          <Button
                            onClick={() => navigate("/user/quiz-result", { state: { result } })}
                            className="flex-1 lg:w-full bg-hot-magenta/10 text-hot-magenta hover:bg-hot-magenta/20 border border-hot-magenta/20"
                          >
                            <Trophy className="mr-2 h-4 w-4" /> View Analysis
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuiz(result.quizId, result.quizTitle)}
                            variant="destructive"
                            className="flex-1 lg:w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </CardContent>

            {totalPages > 1 && (
              <div className="flex justify-center gap-4 pt-6">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Previous
                </Button>
                <span className="text-gray-400 self-center">Page {currentPage} of {totalPages}</span>
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
