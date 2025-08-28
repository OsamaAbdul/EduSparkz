// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from "lucide-react";
// import { toast } from "sonner";

// const QuizResults = () => {
//   const [results, setResults] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedResults = localStorage.getItem("quizResult");
//     if (storedResults) {
//       setResults(JSON.parse(storedResults));
//     } else {
//       navigate("/user/dashboard");
//     }
//   }, [navigate]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const getScoreColor = (percentage) => {
//     if (percentage >= 80) return "text-green-400";
//     if (percentage >= 60) return "text-yellow-400";
//     return "text-red-400";
//   };

//   const getScoreBg = (percentage) => {
//     if (percentage >= 80) return "from-green-600 to-emerald-600";
//     if (percentage >= 60) return "from-yellow-600 to-orange-600";
//     return "from-red-600 to-pink-600";
//   };

//   const handleRetakeQuiz = () => {
//     if (results?.quizId) {
//       toast.success("Retaking quiz...");
//       navigate("/user/dashboard", {
//         state: { retakeQuizId: results.quizId, retakeQuizTitle: results.quizTitle || "Retake Quiz" },
//       });
//     }
//   };

//   if (!results) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Loading results...</div>
//       </div>
//     );
//   }

//   const percentage = (results.score / results.total) * 100;

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
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white">{results.score}</div>
//                 <div className="text-purple-300">Correct Answers</div>
//               </div>
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
//                   <Clock className="w-6 h-6" />
//                   {formatTime(results.duration)}
//                 </div>
//                 <div className="text-purple-300">Time Taken</div>
//               </div>
//               <div className="text-center p-4 bg-purple-900/30 rounded-lg">
//                 <div className="text-2xl font-bold text-white">{results.level}</div>
//                 <div className="text-purple-300">Level</div>
//               </div>
//             </div>
//             <div className="text-center p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg">
//               <p className="text-white text-lg">{results.motivationalMessage}</p>
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
//                   {result.status === "correct" ? (
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
//                         <Badge variant={result.status === "correct" ? "default" : "destructive"}>
//                           {result.selectedAnswer}
//                         </Badge>
//                       </div>
//                       {result.status === "incorrect" && (
//                         <div className="flex items-center gap-2">
//                           <span className="text-purple-300">Correct answer:</span>
//                           <Badge variant="default" className="bg-green-600">
//                             {result.correctAnswer}
//                           </Badge>
//                         </div>
//                       )}
//                       <div className="text-gray-300 text-sm mt-2">{result.explanation}</div>
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
//             onClick={() => navigate("/user/dashboard")}
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

const QuizResults = () => {
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResult');
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      // Display motivational message as a toast
      toast.success(parsedResults.motivationalMessage, {
        style: {
          background: parsedResults.score / parsedResults.total >= 0.7 ? '#10B981' : '#3B82F6',
          color: '#FFFFFF',
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
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (percentage) => {
    if (percentage >= 80) return 'from-green-600 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-600 to-orange-600';
    return 'from-red-600 to-pink-600';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz results...</div>
      </div>
    );
  }

  const percentage = (results.score / results.total) * 100;
  const avgAnswerTime = results.results.reduce((sum, r) => sum + (r.timeTaken || 0), 0) / results.results.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Results</h1>
          <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
            {results.score}/{results.total}
          </div>
          <div className={`text-2xl font-semibold bg-gradient-to-r ${getScoreBg(percentage)} bg-clip-text text-transparent`}>
            <h1 className="text-white">{percentage.toFixed(1)}%</h1>
          </div>
        </div>

        <Card className="bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="text-yellow-400" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                <div className="text-2xl font-bold text-white">{results.score}</div>
                <div className="text-purple-300">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Clock className="w-6 h-6" />
                  {formatTime(results.duration)}
                </div>
                <div className="text-purple-300">Total Time</div>
              </div>
              <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                <div className="text-2xl font-bold text-white">{results.level}</div>
                <div className="text-purple-300">Level</div>
              </div>
              <div className="text-center p-4 bg-purple-900/30 rounded-lg">
                <div className="text-2xl font-bold text-white">{avgAnswerTime.toFixed(2)}s</div>
                <div className="text-purple-300">Avg. Answer Time</div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg">
              <p className={`text-lg font-semibold ${getScoreColor(percentage)}`}>{results.motivationalMessage}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Detailed Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.results.map((result, index) => (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  {result.status === 'correct' ? (
                    <CheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="text-red-400 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-white font-medium mb-2">
                      Question {index + 1}: {result.question}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300">Your answer:</span>
                        <Badge variant={result.status === 'correct' ? 'default' : 'destructive'}>
                          {result.selectedAnswer}
                        </Badge>
                      </div>
                      {result.status === 'incorrect' && (
                        <div className="flex items-center gap-2">
                          <span className="text-purple-300">Correct answer:</span>
                          <Badge variant="default" className="bg-green-600">
                            {result.correctAnswer}
                          </Badge>
                        </div>
                      )}
                      <div className="text-gray-300 text-sm mt-2">{result.explanation}</div>
                      <div className="text-purple-300 text-sm">
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
          <Button
            onClick={() => navigate('/user/dashboard')}
            variant="outline"
            className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;