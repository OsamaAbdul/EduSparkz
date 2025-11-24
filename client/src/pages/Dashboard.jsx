import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Sidebar } from "../layouts/Sidebar.jsx";
import Header from "../layouts/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Trophy, Users, Quote, ArrowRight, Upload, FileText, Brain } from "lucide-react";
import { useUser } from "../context/useContext.jsx";
import { supabase } from "../lib/supabase";

const PIDGIN_QUOTES = [
  "No gree for anybody, read your book!",
  "Success no be beans, you gats work am.",
  "Who read book no go carry last.",
  "Knowledge na power, make you grab am.",
  "School sweet but na exam make am bitter, prepare well!",
  "Read today, lead tomorrow. No be joke!",
  "If you no read, you go red. Oya study!",
];

export const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLaptop = useMediaQuery({ minWidth: 1024 });
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setSidebarOpen(isLaptop);
    // Set random quote
    setQuote(PIDGIN_QUOTES[Math.floor(Math.random() * PIDGIN_QUOTES.length)]);
  }, [isLaptop]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats", user?.id],
    queryFn: async () => {
      const [materials, quizzes, leaderboard] = await Promise.all([
        supabase.from("materials").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_results").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_results").select("score, total").eq("user_id", user.id) // For average score
      ]);

      const totalScore = leaderboard.data?.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) || 0;
      const avgScore = leaderboard.data?.length ? (totalScore / leaderboard.data.length).toFixed(1) : 0;

      return {
        materialsCount: materials.count || 0,
        quizzesCount: quizzes.count || 0,
        avgScore: avgScore,
      };
    },
    enabled: !!user?.id,
  });

  // Fetch Suggested Users (Mock/Simple for now)
  const { data: suggestedUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["suggestedUsers", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .neq("id", user.id)
        .limit(3);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <DashboardLayout>
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
                overflow-hidden lg:overflow-visible`}
            >
              <Sidebar
                isOpen={sidebarOpen}
                iconOnly={!sidebarOpen && isLaptop}
                toggleSidebar={toggleSidebar}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/70 border-b border-[#ACBDAA]/20 transition-colors duration-300">
            <Header toggleSidebar={toggleSidebar} className="w-full" />
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* Welcome Section */}
              <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">
                    Dashboard
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Here's an overview of your learning journey.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/user/start-quiz")}
                  className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90 w-full md:w-auto"
                >
                  <Brain className="mr-2 h-4 w-4" /> Start New Quiz
                </Button>
              </motion.div>

              {/* Stats Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-[#ACBDAA]/70">
                      Materials Uploaded
                    </CardTitle>
                    <FileText className="h-4 w-4 text-[#ACBDAA]" />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 bg-[#ACBDAA]/20" />
                    ) : (
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{stats?.materialsCount}</div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Documents in your library</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-[#ACBDAA]/70">
                      Quizzes Taken
                    </CardTitle>
                    <Brain className="h-4 w-4 text-[#ACBDAA]" />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 bg-[#ACBDAA]/20" />
                    ) : (
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{stats?.quizzesCount}</div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total quizzes completed</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-[#ACBDAA]/70">
                      Average Score
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-[#ACBDAA]" />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 bg-[#ACBDAA]/20" />
                    ) : (
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{stats?.avgScore}%</div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your performance average</p>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quote of the Day */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Card className="h-full bg-gradient-to-br from-[#ACBDAA]/20 to-transparent border border-[#ACBDAA]/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#1E2D4C] dark:text-[#ACBDAA]">
                        <Quote className="h-5 w-5" /> Daily Motivation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center h-[150px]">
                      <blockquote className="text-xl md:text-2xl font-medium italic text-[#1E2D4C] dark:text-[#ACBDAA] text-center">
                        "{quote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Connect with Others */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <Card className="h-full bg-white/80 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#1E2D4C] dark:text-[#ACBDAA]">
                        <Users className="h-5 w-5" /> Study Buddies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {usersLoading ? (
                          [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-10 w-10 rounded-full bg-[#ACBDAA]/20" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full bg-[#ACBDAA]/20" />
                                <Skeleton className="h-3 w-2/3 bg-[#ACBDAA]/20" />
                              </div>
                            </div>
                          ))
                        ) : suggestedUsers?.length > 0 ? (
                          suggestedUsers.map((u) => (
                            <div key={u.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#ACBDAA]/20 flex items-center justify-center text-[#1E2D4C] dark:text-[#ACBDAA] font-bold">
                                  {u.full_name?.[0] || u.username?.[0] || "U"}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#1E2D4C] dark:text-[#ACBDAA]">{u.full_name || u.username}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Learning similar topics</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-[#ACBDAA]">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No other users found yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA] mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2 border-[#ACBDAA]/30 hover:bg-[#ACBDAA]/10 hover:border-[#ACBDAA] w-full"
                    onClick={() => navigate("/user/start-quiz")}
                  >
                    <Upload className="h-6 w-6 text-[#ACBDAA]" />
                    <span className="text-[#1E2D4C] dark:text-[#ACBDAA]">Upload Material</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2 border-[#ACBDAA]/30 hover:bg-[#ACBDAA]/10 hover:border-[#ACBDAA] w-full"
                    onClick={() => navigate("/user/materials")}
                  >
                    <FileText className="h-6 w-6 text-[#ACBDAA]" />
                    <span className="text-[#1E2D4C] dark:text-[#ACBDAA]">My Library</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2 border-[#ACBDAA]/30 hover:bg-[#ACBDAA]/10 hover:border-[#ACBDAA] w-full"
                    onClick={() => navigate("/user/leaderboard")}
                  >
                    <Trophy className="h-6 w-6 text-[#ACBDAA]" />
                    <span className="text-[#1E2D4C] dark:text-[#ACBDAA]">Leaderboard</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center gap-2 border-[#ACBDAA]/30 hover:bg-[#ACBDAA]/10 hover:border-[#ACBDAA] w-full"
                    onClick={() => navigate("/user/history")}
                  >
                    <BookOpen className="h-6 w-6 text-[#ACBDAA]" />
                    <span className="text-[#1E2D4C] dark:text-[#ACBDAA]">History</span>
                  </Button>
                </div>
              </motion.div>

            </motion.div>
          </main>
        </div>

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

export default Dashboard;
