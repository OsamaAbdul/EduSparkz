import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "../components/dasboard/DashboardLayout.jsx";
import { Sidebar } from "../components/dasboard/Sidebar.jsx";
import { Header } from "../components/dasboard/Header.jsx";
import { FileUploadCard } from "../components/dasboard/FileUploadCard.jsx";
import Quiz from "../pages/Quiz.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1025, maxHeight: 1280 });
  const location = useLocation();

  useEffect(() => {
    const { retakeQuizId, retakeQuizTitle } = location.state || {};
    if (retakeQuizId) {
      console.log("Retake quiz triggered:", { retakeQuizId, retakeQuizTitle });
      setLoading(true);
      setQuizId(retakeQuizId);
      setQuizTitle(retakeQuizTitle || "Retaking Quiz....");
      setTimeout(() => setLoading(false), 1000);
    }
  }, [location.state]);

  const handleQuizGenerated = (id, title = "Generated Quiz") => {
    console.log("Quiz generated:", { id, title });
    setLoading(true);
    setQuizId(id);
    setQuizTitle(title);
    setTimeout(() => setLoading(false), 1000);
  };

  const resetQuiz = () => {
    console.log("Resetting quiz");
    setQuizId(null);
    setQuizTitle("");
    setLoading(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      console.log("Toggling sidebar, new state:", !prev);
      return !prev;
    });
  };

  console.log("Rendering Dashboard, sidebarOpen:", sidebarOpen, "isMobile:", isMobile);

  return (
    <DashboardLayout>
      {/* Sidebar: Always shown, icons only on mobile */}
      <div
        className={`sticky top-0 h-screen transition-all duration-300 ${
          isMobile ? "w-16" : sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {loading && !isMobile ? (
          <div className="h-full bg-gray-900 p-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Sidebar
            key={sidebarOpen ? "open" : "closed"} 
            isOpen={isMobile ? false : sidebarOpen} 
            toggleSidebar={toggleSidebar}
          />
        )}
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header: Always shown */}
        <div className="sticky top-0 z-50 bg-black/80">
          {loading && !isMobile ? (
            <div className="p-4 flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-8" />
            </div>
          ) : (
            <Header toggleSidebar={toggleSidebar} />
          )}
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 items-center justify-center min-h-full">
            {loading && !isMobile ? (
              quizId ? (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/4" />
                  </CardContent>
                </Card>
              ) : (
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/2 mt-4" />
                  </CardContent>
                </Card>
              )
            ) : quizId ? (
              <Quiz quizId={quizId} quizTitle={quizTitle} onComplete={resetQuiz} />
            ) : (
              <FileUploadCard
                title="Upload PDF and start Quizzing"
                description="Upload a PDF to generate a quiz"
                accept="application/pdf"
                onQuizGenerated={handleQuizGenerated}
              />
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;