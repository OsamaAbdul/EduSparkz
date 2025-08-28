// import { useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { useNavigate } from "react-router-dom";

// export const QuizCard = ({ quiz, onSubmit, onCancel }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [timeLeft, setTimeLeft] = useState(quiz?.duration || 300);
//   const [startTime] = useState(Date.now());
//   const navigate = useNavigate();

//   // Reset answers on mount for retake
//   useEffect(() => {
//     setAnswers({});
//     setCurrentQuestion(0);
//     setTimeLeft(quiz?.duration || 300);
//   }, [quiz]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit();
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const handleAnswerChange = (value) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [currentQuestion]: {
//         questionIndex: currentQuestion,
//         selectedAnswer: value,
//       },
//     }));
//   };

//   const handleNext = () => {
//     if (currentQuestion < quiz.questions.length - 1) {
//       setCurrentQuestion((prev) => prev + 1);
//     } else {
//       handleSubmit();
//     }
//   };

//   const handleBack = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion((prev) => prev - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     const duration = Math.floor((Date.now() - startTime) / 1000);
//     const answersArray = Object.values(answers);

//     try {
//       await onSubmit({
//         quizId: quiz.quizId,
//         answers: answersArray,
//         duration,
//       });
//       navigate("/user/quiz-result");
//     } catch (error) {
//       console.error("Error submitting quiz:", error);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const currentQ = quiz?.questions[currentQuestion];
//   const progress = ((currentQuestion + 1) / quiz?.questions?.length) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <Card className="w-full max-w-2xl bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
//         <CardHeader className="pb-4">
//           <div className="flex justify-between items-center mb-4">
//             <CardTitle className="text-2xl font-bold text-white">
//               {quiz.title} - Question {currentQuestion + 1} of {quiz?.questions?.length}
//             </CardTitle>
//             <div
//               className={`text-lg font-mono px-3 py-1 rounded ${
//                 timeLeft <= 30 ? "text-red-400 bg-red-900/30" : "text-purple-300 bg-purple-900/30"
//               }`}
//             >
//               {formatTime(timeLeft)}
//             </div>
//           </div>
//           <div className="w-full bg-slate-700 rounded-full h-2">
//             <div
//               className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           <div className="text-white text-lg leading-relaxed">{currentQ?.question}</div>

//           <RadioGroup
//             value={answers[currentQuestion]?.selectedAnswer || ""}
//             onValueChange={handleAnswerChange}
//             className="space-y-3"
//           >
//             {currentQ?.options?.map((option, index) => {
//               const optionLetter = String.fromCharCode(65 + index);
//               return (
//                 <div
//                   key={index}
//                   className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-900/20 transition-colors"
//                 >
//                   <RadioGroupItem
//                     value={optionLetter}
//                     id={`option-${index}`}
//                     className="border-purple-400 text-purple-400"
//                   />
//                   <Label
//                     htmlFor={`option-${index}`}
//                     className="text-white cursor-pointer flex-1 text-base"
//                   >
//                     <span className="font-medium text-purple-300 mr-2">{optionLetter})</span>
//                     {option}
//                   </Label>
//                 </div>
//               );
//             })}
//           </RadioGroup>

//           <div className="flex justify-between pt-6">
//             <Button
//               onClick={handleBack}
//               disabled={currentQuestion === 0}
//               variant="outline"
//               className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
//             >
//               Back
//             </Button>
//             <div className="flex space-x-4">
//               <Button
//                 onClick={onCancel}
//                 variant="outline"
//                 className="bg-transparent border-gray-500 text-gray-300 hover:bg-gray-900/30"
//               >
//                 Cancel Quiz
//               </Button>
//               <Button
//                 onClick={handleNext}
//                 disabled={!answers[currentQuestion]?.selectedAnswer}
//                 className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
//               >
//                 {currentQuestion === quiz?.questions?.length - 1 ? "Submit Quiz" : "Next"}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default QuizCard;




import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export const QuizCard = ({ quiz, onSubmit, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz?.duration || 300);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const navigate = useNavigate();

  // Reset answers and timers on mount for retake
  useEffect(() => {
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(quiz?.duration || 300);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  }, [quiz]);

  // Update question start time when moving to a new question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  // Timer for quiz duration
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (value) => {
    const timeTaken = (Date.now() - questionStartTime) / 1000; 
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: {
        questionIndex: currentQuestion,
        selectedAnswer: value,
        timeTaken, 
      },
    }));
  };

  const handleNext = () => {
    if (!answers[currentQuestion]?.selectedAnswer) return; 

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // ====Update timeTaken for the current question if an answer was selected==
    if (answers[currentQuestion]?.selectedAnswer) {
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: {
          ...prev[currentQuestion],
          timeTaken,
        },
      }));
    }

    const duration = Math.floor((Date.now() - startTime) / 1000);
    const answersArray = Object.values(answers).filter((answer) => answer.selectedAnswer); 

    try {
      await onSubmit({
        quizId: quiz.quizId,
        answers: answersArray,
        duration,
      });
      navigate('/user/quiz-result');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz?.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz?.questions?.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/80 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold text-white">
              {quiz.title} - Question {currentQuestion + 1} of {quiz?.questions?.length}
            </CardTitle>
            <div
              className={`text-lg font-mono px-3 py-1 rounded ${
                timeLeft <= 30 ? 'text-red-400 bg-red-900/30' : 'text-purple-300 bg-purple-900/30'
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-white text-lg leading-relaxed">{currentQ?.question}</div>

          <RadioGroup
            value={answers[currentQuestion]?.selectedAnswer || ''}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQ?.options?.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-900/20 transition-colors"
                >
                  <RadioGroupItem
                    value={optionLetter}
                    id={`option-${index}`}
                    className="border-purple-400 text-purple-400"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-white cursor-pointer flex-1 text-base"
                  >
                    <span className="font-medium text-purple-300 mr-2">{optionLetter})</span>
                    {option}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex justify-between pt-6">
            <Button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              variant="outline"
              className="bg-transparent border-purple-500 text-purple-300 hover:bg-purple-900/30"
            >
              Back
            </Button>
            <div className="flex space-x-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="bg-transparent border-gray-500 text-gray-300 hover:bg-gray-900/30"
              >
                Cancel Quiz
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]?.selectedAnswer}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {currentQuestion === quiz?.questions?.length - 1 ? 'Submit Quiz' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCard;