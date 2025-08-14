// import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { DashboardLayout } from "../components/dasboard/DashboardLayout.jsx";
// import { Sidebar } from "../components/dasboard/Sidebar.jsx";
// import { Header } from "../components/dasboard/Header.jsx";
// import { FileUploadCard } from "../components/dasboard/FileUploadCard.jsx";
// import Quiz from "../pages/Quiz.jsx";

// export const Dashboard = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [quizId, setQuizId] = useState(null);
//   const [quizTitle, setQuizTitle] = useState("");
//   const location = useLocation();

//   useEffect(() => {
//     const { retakeQuizId, retakeQuizTitle } = location.state || {};
//     if (retakeQuizId) {
//       setQuizId(retakeQuizId);
//       setQuizTitle(retakeQuizTitle || "Retake Quiz");
//     }
//   }, [location.state]);

//   const handleQuizGenerated = (id, title = "Generated Quiz") => {
//     setQuizId(id);
//     setQuizTitle(title);
//   };

//   const resetQuiz = () => {
//     setQuizId(null);
//     setQuizTitle("");
//   };

//   return (
//     <DashboardLayout>
//       {/* Sidebar: Sticky with full viewport height, responsive */}
//       <div className={`sticky top-0 h-screen ${sidebarOpen ? 'block w-64' : 'hidden md:block md:w-16'}`}>
//         <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//       </div>
//       <div className="flex-1 flex flex-col min-h-screen">
//         {/* Header: Sticky at the top */}
//         <div className="sticky top-0 z-50 bg-black/80">
//           <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         </div>
//         <main className="flex-1 p-6 overflow-y-auto">
//           <div className="grid grid-cols-1 items-center justify-center min-h-full">
//             {quizId ? (
//               <Quiz quizId={quizId} quizTitle={quizTitle} onComplete={resetQuiz} />
//             ) : (
//               <FileUploadCard
//                 title="Upload PDF and start Quizzing"
//                 description="Upload a PDF to generate a quiz"
//                 accept="application/pdf"
//                 onQuizGenerated={handleQuizGenerated}
//               />
//             )}
//           </div>
//         </main>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;



import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "../components/dasboard/DashboardLayout.jsx";
import { Sidebar } from "../components/dasboard/Sidebar.jsx";
import { Header } from "../components/dasboard/Header.jsx";
import { FileUploadCard } from "../components/dasboard/FileUploadCard.jsx";
import Quiz from "../pages/Quiz.jsx";
import { Skeleton } from "@/components/ui/skeleton"; // shadcn Skeleton component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // shadcn Card components

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(false); 
  const location = useLocation();

  useEffect(() => {
    const { retakeQuizId, retakeQuizTitle } = location.state || {};
    if (retakeQuizId) {
      setLoading(true); 
      setQuizId(retakeQuizId);
      setQuizTitle(retakeQuizTitle || "Retaking Quiz....");
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

  return (
    <DashboardLayout>
      {/* Sidebar: Sticky with full viewport height, responsive */}
      <div className={`sticky top-0 h-screen ${sidebarOpen ? 'block w-64' : 'hidden md:block md:w-16'}`}>
        {loading ? (
          <div className="h-full bg-gray-900 p-4 space-y-4">
            <Skeleton className="h-8 w-3/4" /> {/* Sidebar title/logo */}
            <Skeleton className="h-10 w-full" /> {/* Nav item */}
            <Skeleton className="h-10 w-full" /> {/* Nav item */}
            <Skeleton className="h-10 w-full" /> {/* Nav item */}
          </div>
        ) : (
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        )}
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header: Sticky at the top */}
        <div className="sticky top-0 z-50 bg-black/80">
          {loading ? (
            <div className="p-4 flex items-center justify-between">
              <Skeleton className="h-8 w-32" /> {/* Logo or title */}
              <Skeleton className="h-8 w-8" /> {/* Toggle button */}
            </div>
          ) : (
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          )}
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 items-center justify-center min-h-full">
            {loading ? (
              quizId ? (
                // Skeleton for Quiz component
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <Skeleton className="h-6 w-1/2" /> {/* Quiz title */}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-3/4" /> {/* Question */}
                    <Skeleton className="h-10 w-full" /> {/* Option */}
                    <Skeleton className="h-10 w-full" /> {/* Option */}
                    <Skeleton className="h-10 w-full" /> {/* Option */}
                    <Skeleton className="h-10 w-1/4" /> {/* Submit button */}
                  </CardContent>
                </Card>
              ) : (
                // Skeleton for FileUploadCard
                <Card className="max-w-md mx-auto">
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3" /> {/* Title */}
                    <Skeleton className="h-4 w-4/5" /> {/* Description */}
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" /> {/* File input */}
                    <Skeleton className="h-10 w-1/2 mt-4" /> {/* Upload button */}
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