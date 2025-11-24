
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
// import { toast } from 'sonner';

// const QuizResults = () => {
//   const [results, setResults] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedResults = localStorage.getItem('quizResult');
//     if (storedResults) {
//       const parsedResults = JSON.parse(storedResults);
//       setResults(parsedResults);
//       // Display motivational message as a toast
//       toast.success(parsedResults.motivationalMessage, {
//         style: {
//           background: parsedResults.score / parsedResults.total >= 0.7 ? '#10B981' : '#3B82F6',
//           color: '#FFFFFF',
//         },
//       });
//     } else {
//       navigate('/user/dashboard');
//     }
//   }, [navigate]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const getScoreColor = (percentage) => {
//     if (percentage >= 80) return 'text-green-400';
//     if (percentage >= 60) return 'text-yellow-400';
//     return 'text-red-400';
//   };

//   const getScoreBg = (percentage) => {
//     if (percentage >= 80) return 'from-green-600 to-emerald-600';
//     if (percentage >= 60) return 'from-yellow-600 to-orange-600';
//     return 'from-red-600 to-pink-600';
//   };

//   const handleRetakeQuiz = () => {
//     if (results?.quizId) {
//       toast.success('Retaking quiz...');
//       navigate('/user/dashboard', {
//         state: { retakeQuizId: results.quizId, retakeQuizTitle: results.quizTitle || 'Retake Quiz' },
//       });
//     }
//   };

//   if (!results) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading quiz results...</div>
//       </div>
//     );
//   }

//   const percentage = (results.score / results.total) * 100;
//   const avgAnswerTime = results.results.reduce((sum, r) => sum + (r.timeTaken || 0), 0) / results.results.length || 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <div className="text-center space-y-4 pt-8">
//           <h1 className="text-4xl font-bold text-white mb-2">Quiz Results</h1>
//           <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
//             {results.score}/{results.total}
//           </div>
//           <div className={`text-2xl font-semibold bg-gradient-to-r ${getScoreBg(percentage)} bg-clip-text text-transparent`}>
//             <h1 className="text-white">{percentage.toFixed(1)}%</h1>
//           </div>
//         </div>

//         <Card className="bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
//           <CardHeader>
//             <CardTitle className="text-white flex items-center gap-2">
//               <Trophy className="text-yellow-400" />
//               Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white">{results.score}</div>
//                 <div className="text-purple-300">Correct Answers</div>
//               </div>
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
//                   <Clock className="w-6 h-6" />
//                   {formatTime(results.duration)}
//                 </div>
//                 <div className="text-purple-300">Total Time</div>
//               </div>
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white">{results.level}</div>
//                 <div className="text-purple-300">Level</div>
//               </div>
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white">{avgAnswerTime.toFixed(2)}s</div>
//                 <div className="text-purple-300">Avg. Answer Time</div>
//               </div>
//             </div>
//             <div className="text-center p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg">
//               <p className={`text-lg font-semibold ${getScoreColor(percentage)}`}>{results.motivationalMessage}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
//           <CardHeader>
//             <CardTitle className="text-white">Detailed Results</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {results.results.map((result, index) => (
//               <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
//                 <div className="flex items-start gap-3 mb-3">
//                   {result.status === 'correct' ? (
//                     <CheckCircle className="text-green-400 mt-1 flex-shrink-0" />
//                   ) : (
//                     <XCircle className="text-red-400 mt-1 flex-shrink-0" />
//                   )}
//                   <div className="flex-1">
//                     <div className="text-white font-medium mb-2">
//                       Question {index + 1}: {result.question}
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-2">
//                         <span className="text-purple-300">Your answer:</span>
//                         <Badge variant={result.status === 'correct' ? 'default' : 'destructive'}>
//                           {result.selectedAnswer}
//                         </Badge>
//                       </div>
//                       {result.status === 'incorrect' && (
//                         <div className="flex items-center gap-2">
//                           <span className="text-purple-300">Correct answer:</span>
//                           <Badge variant="default" className="bg-green-600">
//                             {result.correctAnswer}
//                           </Badge>
//                         </div>
//                       )}
//                       <div className="text-gray-300 text-sm mt-2">{result.explanation}</div>
//                       <div className="text-purple-300 text-sm">
//                         Time Taken: {result.timeTaken.toFixed(2)} seconds
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         <div className="flex justify-center gap-4 pb-8">
//           <Button
//             onClick={handleRetakeQuiz}
//             className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
//           >
//             <RotateCcw className="mr-2 h-4 w-4" />
//             Retake Quiz
//           </Button>
//           <Button
//             onClick={() => navigate('/user/dashboard')}
//             variant="outline"
//             className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
//           >
//             Back to Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizResults;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Sidebar } from "../layouts/Sidebar.jsx";
import Header from "../layouts/Header.jsx";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";

const QuizResults = () => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLaptop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    setSidebarOpen(isLaptop);
  }, [isLaptop]);

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResult');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      toast.success(parsedResults.motivationalMessage, {
        style: {
          background: '#ACBDAA',
          color: '#1E2D4C',
        },
      });
    } else {
      navigate('/user/dashboard');
    }
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-[#ACBDAA] dark:text-[#ACBDAA]';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (percentage) => {
    if (percentage >= 80) return 'from-[#ACBDAA] to-[#ACBDAA]/70';
    if (percentage >= 60) return 'from-yellow-600 to-orange-500';
    return 'from-red-600 to-pink-500';
  };

  const handleRetakeQuiz = () => {
    if (results?.quizId) {
      toast.success('Retaking quiz...');
      navigate('/user/dashboard', {
        state: { retakeQuizId: results.quizId, retakeQuizTitle: results.quizTitle || 'Retake Quiz' },
      });
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1E2D4C]">
        <div className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl">Loading quiz results...</div>
      </div>
    );
  }

  const percentage = (results.score / results.total) * 100;
  const avgAnswerTime = results.results.reduce((sum, r) => sum + (r.timeTaken || 0), 0) / results.results.length || 0;

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
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-4 pt-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA] mb-2">Quiz Results</h1>
                <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(percentage)}`}>
                  {results.score}/{results.total}
                </div>
                <div className={`text-2xl font-semibold bg-gradient-to-r ${getScoreBg(percentage)} bg-clip-text text-transparent`}>
                  <h2 className="text-[#1E2D4C] dark:text-white">{percentage.toFixed(1)}%</h2>
                </div>
              </div>

              <Card className="bg-white/70 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 backdrop-blur-sm shadow-lg shadow-[#ACBDAA]/10 dark:shadow-[#ACBDAA]/20">
                <CardHeader>
                  <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] flex items-center gap-2">
                    <Trophy className="text-yellow-500 dark:text-yellow-400" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/5 rounded-lg border border-[#ACBDAA]/20">
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{results.score}</div>
                      <div className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70 text-sm">Correct Answers</div>
                    </div>
                    <div className="text-center p-4 bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/5 rounded-lg border border-[#ACBDAA]/20">
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA] flex items-center justify-center gap-2">
                        <Clock className="w-5 h-5" />
                        {formatTime(results.duration)}
                      </div>
                      <div className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70 text-sm">Total Time</div>
                    </div>
                    <div className="text-center p-4 bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/5 rounded-lg border border-[#ACBDAA]/20">
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{results.level}</div>
                      <div className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70 text-sm">Level</div>
                    </div>
                    <div className="text-center p-4 bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/5 rounded-lg border border-[#ACBDAA]/20">
                      <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{avgAnswerTime.toFixed(2)}s</div>
                      <div className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70 text-sm">Avg. Answer Time</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-[#ACBDAA]/20 dark:bg-[#ACBDAA]/10 rounded-lg border border-[#ACBDAA]/30">
                    <p className={`text-lg font-semibold ${getScoreColor(percentage)}`}>{results.motivationalMessage}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 backdrop-blur-sm shadow-lg shadow-[#ACBDAA]/10 dark:shadow-[#ACBDAA]/20">
                <CardHeader>
                  <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA]">Detailed Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.results.map((result, index) => (
                    <div key={index} className="p-4 bg-white/50 dark:bg-[#1E2D4C]/40 rounded-lg border border-[#ACBDAA]/20">
                      <div className="flex items-start gap-3 mb-3">
                        {result.status === 'correct' ? (
                          <CheckCircle className="text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="text-[#1E2D4C] dark:text-[#ACBDAA] font-medium mb-2">
                            Question {index + 1}: {result.question}
                          </div>
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70 text-sm">Your answer:</span>
                              <Badge variant={result.status === 'correct' ? 'default' : 'destructive'} className={`${result.status === 'correct' ? 'bg-[#ACBDAA] text-[#1E2D4C]' : 'bg-red-500 text-white'}`}>
                                {result.selectedAnswer}
                              </Badge>
                            </div>
                            {result.status === 'incorrect' && (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70 text-sm">Correct answer:</span>
                                <Badge className="bg-green-600 text-white hover:bg-green-700">
                                  {result.correctAnswer}
                                </Badge>
                              </div>
                            )}
                            <div className="text-[#1E2D4C]/80 dark:text-[#ACBDAA]/80 text-sm mt-2 italic">{result.explanation}</div>
                            <div className="text-[#1E2D4C]/60 dark:text-[#ACBDAA]/60 text-xs">
                              Time Taken: {result.timeTaken.toFixed(2)} seconds
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 pb-8">
                <Button
                  onClick={handleRetakeQuiz}
                  className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
                <Button
                  onClick={() => navigate('/user/dashboard')}
                  variant="outline"
                  className="border-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA] hover:bg-[#ACBDAA]/10"
                >
                  Back to Dashboard
                </Button>
              </div>
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
    </DashboardLayout>
  );
};

export default QuizResults;
