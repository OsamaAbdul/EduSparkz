// import { useEffect, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Trophy, Medal, Clock } from "lucide-react";
// import { useUser } from "../context/useContext.jsx";
// import { toast } from "sonner";
// import { DashboardLayout } from "../components/dasboard/DashboardLayout.jsx";
// import { Sidebar } from "../components/dasboard/Sidebar.jsx";
// import { Header } from "../components/dasboard/Header.jsx";

// // Custom CSS for spinner (inherited from FileUploadCard and History)
// const spinnerStyles = `
//   .custom-spinner {
//     width: 32px;
//     height: 32px;
//     border: 4px solid rgba(255, 255, 255, 0.1);
//     border-top: 4px solid #a855f7; /* Matches purple-400 */
//     border-radius: 50%;
//     animation: spin 1s linear infinite;
//   }
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;

// const Leaderboard = () => {
//   const { user } = useUser();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [limit, setLimit] = useState(5); 
//   const [loadingText, setLoadingText] = useState("Fetching leaderboard...");

//   useEffect(() => {
//     if (!user?.token) {
//       navigate("/api/auth/login");
//     }
//   }, [user, navigate]);

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["leaderboard", user?.token, limit],
//     queryFn: async () => {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/user/leaderboard?limit=${limit}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       console.log("Leaderboard fetch response:", response); 
//       if (!response.ok) {
//         if (response.status === 401) navigate("/login");
//         throw new Error("Failed to fetch leaderboard");
//       }
//       return response.json();
//     },
//     enabled: !!user?.token,
//   });

//   useEffect(() => {
//     if (isLoading) {
//       const texts = ["Fetching leaderboard...", "Processing...", "Loading..."];
//       let index = 0;
//       const interval = setInterval(() => {
//         setLoadingText(texts[index]);
//         index = (index + 1) % texts.length;
//       }, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [isLoading]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error.message || "Failed to load leaderboard");
//     }
//   }, [error]);

//   const formatTime = (seconds) => {
//     if (!seconds) return "N/A";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.round(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getRankIcon = (rank) => {
//     if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
//     if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
//     if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
//     return <span className="w-6 h-6 flex items-center justify-center text-gray-400">{rank}</span>;
//   };

//   const getLevelColor = (level) => {
//     switch (level) {
//       case "Advanced": return "text-blue-400";
//       case "Intermediate": return "text-green-400";
//       case "Beginner": return "text-yellow-400";
//       case "Novice": return "text-gray-400";
//       default: return "text-gray-400";
//     }
//   };

//   const leaderboardData = data?.leaderboard || [];
//   console.log("Leaderboard data:", leaderboardData);

//   return (
//     <DashboardLayout>
//       <style>{spinnerStyles}</style>
//       <div className={`sticky top-0 h-screen overflow-y-auto ${sidebarOpen ? 'block w-64 min-w-[16rem]' : 'hidden md:block md:w-16 md:min-w-[4rem]'}`}>
//         <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//       </div>
//       <div className="flex-1 flex flex-col min-h-screen">
//         <div className="sticky top-0 z-50 bg-black/80">
//           <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
//         </div>
//         <main className="flex-1 p-6 overflow-y-auto">
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center min-h-full space-y-2">
//               <div className="custom-spinner" />
//               <span className="text-white">{loadingText}</span>
//             </div>
//           ) : error ? (
//             <div className="flex-1 flex items-center justify-center min-h-full">
//               <div className="text-white text-xl flex flex-col items-center gap-4">
//                 <p>Error: {error.message}</p>
//                 <Button
//                   onClick={() => refetch()}
//                   className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
//                 >
//                   Retry
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     console.log("Navigating to dashboard from leaderboard"); 
//                     navigate("/user/dashboard");
//                   }}
//                   variant="outline"
//                   className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
//                 >
//                   Back to Dashboard
//                 </Button>
//               </div>
//             </div>
//           ) : leaderboardData.length === 0 ? (
//             <div className="flex flex-col items-center justify-center min-h-full space-y-4">
//               <div className="text-white text-xl">No leaderboard data available</div>
//               <Button
//                 onClick={() => {
//                   console.log("Navigating to dashboard from leaderboard (empty state)"); // Debug navigation
//                   navigate("/user/dashboard");
//                 }}
//                 variant="outline"
//                 className="bg-transparent border-purple-500 text-purple-300"
//               >
//                 Back to Dashboard
//               </Button>
//             </div>
//           ) : (
//             <div className="max-w-4xl mx-auto space-y-6">
//               <div className="text-center space-y-4 pt-8">
//                 <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
//                 <p className="text-purple-300">See how you stack up against other quiz champions!</p>
//               </div>

//               <Card className="bg-black/60 border border-purple-500/20 backdrop-blur-md rounded-2xl shadow-2xl">
//                 <CardHeader>
//                   <CardTitle className="text-white flex items-center gap-2 text-2xl font-semibold">
//                     <Trophy className="text-yellow-400" />
//                     Top Performers
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {leaderboardData.map((entry, index) => {
//                     const isTopThree = entry.rank <= 3;
//                     return (
//                       <div
//                         key={entry.username}
//                         className={`flex items-center justify-between p-4 rounded-xl transition-transform duration-200 border border-slate-700/40 hover:scale-[1.01] bg-gradient-to-r from-slate-800/40 via-slate-900/40 to-black/40 ${
//                           isTopThree ? "shadow-[0_0_20px_2px_rgba(192,132,252,0.2)]" : ""
//                         }`}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className="w-8 h-8 flex items-center justify-center text-white font-bold text-lg">
//                             {getRankIcon(entry.rank)}
//                           </div>
//                           <div>
//                             <div className="text-white text-lg font-semibold">{entry.username}</div>
//                             <div className={`text-sm ${getLevelColor(entry.highestLevel)}`}>
//                               {entry.highestLevel}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right space-y-1">
//                           <div className="text-purple-300 font-medium">
//                             {entry.averageScorePercentage}% Avg Score
//                           </div>
//                           <div className="text-gray-400 text-sm">{entry.totalQuizzes} Quizzes</div>
//                           <div className="flex justify-end items-center gap-1 text-gray-400 text-sm">
//                             <Clock className="w-4 h-4" />
//                             {formatTime(entry.averageDuration)}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </CardContent>
//               </Card>

//               <div className="flex justify-center gap-4 pb-8">
//                 <Button
//                   onClick={() => setLimit((prev) => Math.max(prev - 10, 10))}
//                   disabled={limit <= 10}
//                   variant="outline"
//                   className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
//                 >
//                   Show Less
//                 </Button>
//                 <Button
//                   onClick={() => setLimit((prev) => Math.min(prev + 10, 100))}
//                   disabled={limit >= 100}
//                   variant="outline"
//                   className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
//                 >
//                   Show More
//                 </Button>
//                 <Button
//                   onClick={() => {
//                     console.log("Navigating to dashboard from leaderboard (main)"); // Debug navigation
//                     navigate("/user/dashboard");
//                   }}
//                   variant="outline"
//                   className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
//                 >
//                   Back to Dashboard
//                 </Button>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Leaderboard;



import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Sidebar } from "../layouts/Sidebar.jsx";
import Header from "../layouts/Header.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Clock } from "lucide-react";
import { useUser } from "../context/useContext.jsx";
import { toast } from "sonner";
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

const Leaderboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [limit, setLimit] = useState(5);
  const [loadingText, setLoadingText] = useState("Fetching leaderboard...");

  const isLaptop = useMediaQuery({ minWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 640 });

  useEffect(() => {
    setSidebarOpen(isLaptop);
  }, [isLaptop]);

  useEffect(() => {
    if (!user?.token) navigate("/api/auth/login");
  }, [user, navigate]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leaderboard", user?.token, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_leaderboard', { limit_count: limit });

      if (error) throw error;

      return { leaderboard: data };
    },
    enabled: !!user?.token,
  });

  useEffect(() => {
    if (isLoading) {
      const texts = ["Fetching leaderboard...", "Processing...", "Loading..."];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[index]);
        index = (index + 1) % texts.length;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error(error.message || "Failed to load leaderboard");
  }, [error]);

  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 dark:text-[#ACBDAA]" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-[#1E2D4C]/60 dark:text-gray-400 font-bold">{rank}</span>;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced": return "text-[#1E2D4C] dark:text-[#ACBDAA]";
      case "Intermediate": return "text-[#1E2D4C]/80 dark:text-[#ACBDAA]/80";
      case "Beginner": return "text-[#1E2D4C]/60 dark:text-[#ACBDAA]/60";
      case "Novice": return "text-gray-500 dark:text-gray-400";
      default: return "text-gray-500 dark:text-gray-400";
    }
  };

  const leaderboardData = data?.leaderboard || [];

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
              <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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
          <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/70 border-b border-[#ACBDAA]/20 transition-colors duration-300 flex items-center justify-center px-0 sm:px-6 py-0">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} className="w-full" />
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="custom-spinner" />
                <span className="text-[#1E2D4C] dark:text-[#ACBDAA]">{loadingText}</span>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <span className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl">No leaderboard data available</span>
                <Button
                  onClick={() => navigate("/user/dashboard")}
                  variant="outline"
                  className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/80 hover:bg-[#ACBDAA]/10"
                >
                  Back to Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <div className="text-center space-y-2 pt-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">Leaderboard</h1>
                  <p className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70">See how you stack up against other quiz champions!</p>
                </div>

                <Card className="bg-white/70 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 backdrop-blur-sm rounded-2xl shadow-2xl shadow-[#ACBDAA]/10 dark:shadow-[#ACBDAA]/20 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] flex items-center gap-2 text-2xl font-semibold">
                      <Trophy className="text-yellow-500 dark:text-yellow-400" /> Top Performers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {leaderboardData.map((entry) => (
                      <div
                        key={entry.username}
                        className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl transition-transform duration-200 border border-[#ACBDAA]/20 hover:scale-[1.01] bg-white/50 dark:bg-gradient-to-r dark:from-[#1E2D4C]/40 dark:via-[#1E2D4C]/50 dark:to-[#1E2D4C]/30 hover:bg-[#ACBDAA]/5"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-8 h-8 flex items-center justify-center text-[#1E2D4C] dark:text-[#ACBDAA] font-bold text-lg">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div>
                            <div className="text-[#1E2D4C] dark:text-[#ACBDAA] text-lg font-semibold">{entry.username}</div>
                            <div className={`text-sm ${getLevelColor(entry.highestLevel)}`}>{entry.highestLevel}</div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end mt-2 sm:mt-0 space-y-1 text-right w-full sm:w-auto">
                          <span className="text-[#1E2D4C]/80 dark:text-[#ACBDAA]/80 font-medium">{entry.averageScorePercentage}% Avg Score</span>
                          <span className="text-[#1E2D4C]/60 dark:text-[#ACBDAA]/60 text-sm">{entry.totalQuizzes} Quizzes</span>
                          <div className="flex justify-end items-center gap-1 text-[#1E2D4C]/50 dark:text-[#ACBDAA]/50 text-sm">
                            <Clock className="w-4 h-4" />
                            {formatTime(entry.averageDuration)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex flex-wrap justify-center gap-4 pb-8">
                  <Button
                    onClick={() => setLimit((prev) => Math.max(prev - 10, 10))}
                    disabled={limit <= 10}
                    variant="outline"
                    className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/70 hover:bg-[#ACBDAA]/10"
                  >
                    Show Less
                  </Button>
                  <Button
                    onClick={() => setLimit((prev) => Math.min(prev + 10, 100))}
                    disabled={limit >= 100}
                    variant="outline"
                    className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]/70 hover:bg-[#ACBDAA]/10"
                  >
                    Show More
                  </Button>
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

export default Leaderboard;
