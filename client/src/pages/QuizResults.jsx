
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
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { motion } from "framer-motion";

const QuizResults = () => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    // Check location state first (passed from History or Quiz)
    if (location.state?.result) {
      setResults(location.state.result);
      if (location.state.result.motivationalMessage) {
        toast.success(location.state.result.motivationalMessage, {
          style: {
            background: '#00F5FF',
            color: '#0B0E17',
          },
        });
      }
      return;
    }

    // Fallback to localStorage
    const storedResults = localStorage.getItem('quizResult');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      toast.success(parsedResults.motivationalMessage, {
        style: {
          background: '#00F5FF',
          color: '#0B0E17',
        },
      });
    } else {
      navigate('/user/dashboard');
    }
  }, [navigate, location]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-electric-cyan';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-500';
  };

  const getScoreBg = (percentage) => {
    if (percentage >= 80) return 'from-electric-cyan to-blue-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const handleRetakeQuiz = () => {
    if (results?.quizId) {
      toast.success('Retaking quiz...');
      navigate('/user/start-quiz', {
        state: { retakeQuizId: results.quizId, retakeQuizTitle: results.quizTitle || 'Retake Quiz' },
      });
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-dark">
        <div className="text-electric-cyan text-xl animate-pulse">Loading quiz results...</div>
      </div>
    );
  }

  const percentage = (results.score / results.total) * 100;
  const avgAnswerTime = results.results.reduce((sum, r) => sum + (r.timeTaken || 0), 0) / results.results.length || 0;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Quiz Results</h1>
          <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(percentage)} drop-shadow-[0_0_15px_rgba(0,245,255,0.5)]`}>
            {results.score}/{results.total}
          </div>
          <div className={`text-2xl font-semibold bg-gradient-to-r ${getScoreBg(percentage)} bg-clip-text text-transparent`}>
            <h2 className="text-white">{percentage.toFixed(1)}%</h2>
          </div>
        </div>

        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-white">{results.score}</div>
                <div className="text-gray-400 text-sm">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-electric-cyan" />
                  {formatTime(results.duration)}
                </div>
                <div className="text-gray-400 text-sm">Total Time</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-white">{results.level}</div>
                <div className="text-gray-400 text-sm">Level</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-white">{avgAnswerTime.toFixed(2)}s</div>
                <div className="text-gray-400 text-sm">Avg. Answer Time</div>
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
              <p className={`text-lg font-semibold ${getScoreColor(percentage)}`}>{results.motivationalMessage}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Detailed Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.results.map((result, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  {result.status === 'correct' ? (
                    <CheckCircle className="text-electric-lime mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="text-red-500 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium mb-2">
                      Question {index + 1}: {result.question}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-400 text-sm">Your answer:</span>
                        <Badge variant={result.status === 'correct' ? 'default' : 'destructive'} className={`${result.status === 'correct' ? 'bg-electric-lime/20 text-electric-lime border-electric-lime/50' : 'bg-red-500/20 text-red-500 border-red-500/50'}`}>
                          {result.selectedAnswer}
                        </Badge>
                      </div>
                      {result.status === 'incorrect' && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-gray-400 text-sm">Correct answer:</span>
                          <Badge className="bg-electric-lime/20 text-electric-lime border-electric-lime/50">
                            {result.correctAnswer}
                          </Badge>
                        </div>
                      )}
                      <div className="text-gray-300 text-sm mt-2 italic border-l-2 border-white/20 pl-3">
                        <span className="font-semibold text-electric-cyan">Explanation: </span>{result.explanation}
                      </div>
                      {result.reference && (
                        <div className="text-gray-400 text-xs mt-2 bg-white/5 p-2 rounded border border-white/5">
                          <span className="font-semibold text-electric-cyan">Reference: </span>"{result.reference}"
                        </div>
                      )}
                      <div className="text-gray-500 text-xs mt-1">
                        Time Taken: {result.timeTaken?.toFixed(2) || 0} seconds
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
            className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold shadow-[0_0_20px_rgba(0,245,255,0.3)]"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
          <Button
            onClick={() => navigate('/user/dashboard')}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10 hover:text-electric-cyan"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default QuizResults;
