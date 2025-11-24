import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Sidebar } from "../layouts/Sidebar.jsx";
import Header from "../layouts/Header.jsx";
import { FileUploadCard } from "../features/dashboard/components/FileUploadCard.jsx";
import { Chatbot } from "../features/dashboard/components/Chatbot.jsx";
import Quiz from "../pages/Quiz.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const isLaptop = useMediaQuery({ minWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(isLaptop);
  }, [isLaptop]);

  useEffect(() => {
    const { retakeQuizId, retakeQuizTitle } = location.state || {};
    if (retakeQuizId) {
      setLoading(true);
      setQuizId(retakeQuizId);
      setQuizTitle(retakeQuizTitle || "Retaking Quiz...");
      setTimeout(() => setLoading(false), 1000);
    }
  }, [location.state]);

  const handleQuizGenerated = (id, title = "Generated Quiz") => {
    setLoading(true);
    setQuizId(id);
    setQuizTitle(title);
    setTimeout(() => setLoading(false), 1000);
  };

  const resetQuiz = () => {
    setQuizId(null);
    setQuizTitle("");
    setLoading(false);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
                overflow-hidden lg:overflow-visible w-64`}
            >
              {loading && isLaptop ? (
                <div className="h-full p-4 space-y-4">
                  <Skeleton className="h-8 w-3/4 bg-[#ACBDAA]/20" />
                  <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                  <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                  <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                </div>
              ) : (
                <Sidebar
                  isOpen={sidebarOpen}
                  iconOnly={!sidebarOpen && isLaptop}
                  toggleSidebar={toggleSidebar}
                />
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          key="main"
          layout
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300`}
        >
          {/* Header */}
          <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/70 border-b border-[#ACBDAA]/20 transition-colors duration-300 flex items-center justify-center px-0 sm:px-6 py-0">
            {loading && isLaptop ? (
              <div className="w-full flex items-center justify-between">
                <Skeleton className="h-8 w-32 bg-[#ACBDAA]/30" />
                <Skeleton className="h-8 w-8 bg-[#ACBDAA]/30" />
              </div>
            ) : (
              <Header toggleSidebar={toggleSidebar} className="w-full" />
            )}
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div
              className={`flex flex-col items-center justify-center min-h-[70vh] space-y-6 ${loading ? "animate-pulse" : ""
                }`}
            >
              {loading && isLaptop ? (
                quizId ? (
                  <Card className="w-full max-w-2xl mx-auto border border-[#ACBDAA]/30 shadow-lg backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/80 dark:border-[#ACBDAA]/20">
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2 bg-[#ACBDAA]/20" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-3/4 bg-[#ACBDAA]/20" />
                      <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                      <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                      <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                      <Skeleton className="h-10 w-1/4 bg-[#ACBDAA]/20" />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="w-full max-w-md mx-auto border border-[#ACBDAA]/30 shadow-lg backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/80 dark:border-[#ACBDAA]/20">
                    <CardHeader>
                      <Skeleton className="h-6 w-2/3 bg-[#ACBDAA]/20" />
                      <Skeleton className="h-4 w-4/5 bg-[#ACBDAA]/20" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full bg-[#ACBDAA]/20" />
                      <Skeleton className="h-10 w-1/2 mt-4 bg-[#ACBDAA]/20" />
                    </CardContent>
                  </Card>
                )
              ) : quizId ? (
                <div className="w-full max-w-3xl px-2 sm:px-4">
                  <Quiz
                    quizId={quizId}
                    quizTitle={quizTitle}
                    onComplete={resetQuiz}
                  />
                </div>
              ) : (
                <div className="w-full px-0">
                  <FileUploadCard
                    title="Upload PDF and Start Quizzing"
                    description="Upload a PDF to generate an engaging quiz"
                    accept="application/pdf"
                    onQuizGenerated={handleQuizGenerated}
                    className="w-full border border-[#ACBDAA]/30 bg-white/80 dark:bg-[#1E2D4C]/80 dark:border-[#ACBDAA]/20 shadow-lg rounded-xl"
                  />
                </div>
              )}
            </div>
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
      <Chatbot />
    </DashboardLayout>
  );
};

export default Dashboard;
