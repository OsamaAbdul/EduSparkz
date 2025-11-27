import { useState, useEffect, useRef } from "react";
import { useUser } from "../context/useContext.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Clock, Flame, Trophy, XCircle, CheckCircle, ArrowRight } from "lucide-react";


const Quiz = ({ quizId, quizTitle, onComplete }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // { questionIndex, selectedAnswer, timeTaken }
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [startTime, setStartTime] = useState(Date.now());
  const [showPidgin, setShowPidgin] = useState(false);
  const [pidginMessage, setPidginMessage] = useState("");

  const pidginPraises = [
    "Omo you too sabi!", "Chai see brain!", "Professor level activated!", "You dey cook!", "No gree for anybody!"
  ];

  const pidginResultQuotes = {
    high: ["Odogwu!", "You do well no be small!", "E choke!", "Sense wan kill you!", "Chairman!"],
    medium: ["You try well well!", "Small remaining make you blow!", "Keep am up!", "Not bad at all!"],
    low: ["No gree for failure, try again!", "You fit do better!", "Go read book come back!", "E go better!"]
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        if (!quizId) throw new Error("No quiz ID provided");
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) throw new Error("Unauthorized");

        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Quiz not found");

        let questions = data.questions.map((mcq) => ({
          question: mcq.question,
          options: mcq.options || [mcq.optionA, mcq.optionB, mcq.optionC, mcq.optionD].filter(Boolean),
          correctAnswer: mcq.correctAnswer,
          correctAnswerText: mcq.answer,
          explanation: mcq.explanation || "No explanation provided.",
          reference: mcq.reference,
          isRetention: false
        }));

        // Fix correctAnswer to be a letter (A, B, C, D) if it's currently the full text
        questions = questions.map(q => {
          if (q.options && q.options.includes(q.correctAnswerText)) {
            const idx = q.options.indexOf(q.correctAnswerText);
            q.correctAnswer = ['A', 'B', 'C', 'D'][idx];
          } else if (!q.correctAnswer && q.correctAnswerText) {
            const idx = q.options.findIndex(opt => opt === q.correctAnswerText);
            if (idx !== -1) q.correctAnswer = ['A', 'B', 'C', 'D'][idx];
          }
          return q;
        });

        // Client-side Retention Logic
        try {
          const { data: history } = await supabase
            .from('quiz_results')
            .select('quiz_id, score, total, submitted_at, quizzes (id, title, questions)')
            .eq('user_id', authUser.id)
            .order('submitted_at', { ascending: false });

          if (history && history.length > 0) {
            const latestAttempts = {};
            history.forEach(h => {
              if (!latestAttempts[h.quiz_id] && h.quizzes) {
                latestAttempts[h.quiz_id] = h;
              }
            });

            const failedQuizzes = Object.values(latestAttempts).filter(h => (h.score / h.total) < 0.7);

            if (failedQuizzes.length > 0) {
              const retentionQuestions = [];
              // Pick up to 2 random failed quizzes
              const shuffledFailed = failedQuizzes.sort(() => 0.5 - Math.random()).slice(0, 2);

              shuffledFailed.forEach(fq => {
                if (fq.quizzes && fq.quizzes.questions && fq.quizzes.questions.length > 0) {
                  const randomQ = fq.quizzes.questions[Math.floor(Math.random() * fq.quizzes.questions.length)];

                  // Ensure options are formatted correctly for retention questions too
                  let options = randomQ.options || [randomQ.optionA, randomQ.optionB, randomQ.optionC, randomQ.optionD].filter(Boolean);
                  let correctAnswer = randomQ.correctAnswer;

                  if (options && options.includes(randomQ.answer)) {
                    const idx = options.indexOf(randomQ.answer);
                    correctAnswer = ['A', 'B', 'C', 'D'][idx];
                  } else if (!correctAnswer && randomQ.answer) {
                    const idx = options.findIndex(opt => opt === randomQ.answer);
                    if (idx !== -1) correctAnswer = ['A', 'B', 'C', 'D'][idx];
                  }

                  retentionQuestions.push({
                    question: randomQ.question,
                    options: options,
                    correctAnswer: correctAnswer,
                    correctAnswerText: randomQ.answer,
                    explanation: randomQ.explanation || "No explanation provided.",
                    isRetention: true,
                    sourceQuizId: fq.quizzes.id,
                    sourceQuizTitle: fq.quizzes.title
                  });
                }
              });

              retentionQuestions.forEach(rq => {
                const insertIndex = Math.floor(Math.random() * (questions.length - 1)) + 1;
                questions.splice(insertIndex, 0, rq);
              });
            }
          }
        } catch (retentionError) {
          console.error("Error fetching retention questions:", retentionError);
        }

        setQuiz({
          quizId: data.id,
          title: quizTitle || data.title || "Generated Quiz",
          questions: questions,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, quizTitle]);

  // Timer Logic
  useEffect(() => {
    if (!quiz || isAnswered) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz, currentQuestionIndex, isAnswered]);

  const handleTimeUp = () => {
    handleAnswer(null, true);
  };

  const handleAnswer = (option, timeUp = false) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(option);

    const currentQ = quiz.questions[currentQuestionIndex];
    const correct = !timeUp && option && option.charAt(0).toUpperCase() === currentQ.correctAnswer;

    setIsCorrect(correct);
    const timeTaken = 30 - timer;

    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#39FF14', '#00F5FF']
      });

      if ((streak + 1) % 3 === 0) {
        setPidginMessage(pidginPraises[Math.floor(Math.random() * pidginPraises.length)]);
        setShowPidgin(true);
        setTimeout(() => setShowPidgin(false), 3000);
      }
    } else {
      setStreak(0);
      // Shake effect handled by Framer Motion
    }

    // Save answer
    setAnswers(prev => [...prev, {
      questionIndex: currentQuestionIndex,
      selectedAnswer: option ? option.charAt(0) : 'Timeout',
      timeTaken
    }]);

    // Next Question Delay
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimer(30);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(false);
        setStartTime(Date.now());
      } else {
        finishQuiz();
      }
    }, 2000);
  };

  const finishQuiz = async () => {
    setLoading(true);
    const totalDuration = answers.reduce((acc, curr) => acc + curr.timeTaken, 0);

    // Construct submission data matching original structure
    const submissionData = {
      answers: answers.map(a => ({
        selectedAnswer: a.selectedAnswer,
        timeTaken: a.timeTaken
      })),
      duration: totalDuration
    };

    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Calculate detailed results
      const results = quiz.questions.map((q, i) => {
        const ans = answers[i];
        const isRight = ans && ans.selectedAnswer === q.correctAnswer;
        return {
          question: q.question,
          selectedAnswer: ans ? ans.selectedAnswer : 'N/A',
          correctAnswer: q.correctAnswer,
          status: isRight ? 'correct' : 'incorrect',
          isRetention: q.isRetention,
          sourceQuizId: q.sourceQuizId,
          sourceQuizTitle: q.sourceQuizTitle,
          explanation: q.explanation,
          reference: q.reference
        };
      });

      // Check retention
      const failedRetention = results.find(r => r.isRetention && r.status === 'incorrect');
      if (failedRetention) {
        navigate('/user/start-quiz', {
          state: {
            retakeQuizId: failedRetention.sourceQuizId,
            retakeQuizTitle: failedRetention.sourceQuizTitle,
            retentionFailed: true
          }
        });
        return;
      }

      const finalScore = results.filter(r => r.status === 'correct').length;
      const total = results.length;
      const percentage = finalScore / total;

      // Update XP and Streak
      const xpGained = finalScore * 10;
      try {
        await supabase.rpc('update_user_xp_and_streak', {
          p_user_id: user.id,
          p_xp_gained: xpGained
        });
      } catch (xpError) {
        console.error("Failed to update XP/Streak:", xpError);
      }

      // Generate Pidgin Message
      let pidginQuote = "";
      if (percentage >= 0.8) {
        pidginQuote = pidginResultQuotes.high[Math.floor(Math.random() * pidginResultQuotes.high.length)];
      } else if (percentage >= 0.5) {
        pidginQuote = pidginResultQuotes.medium[Math.floor(Math.random() * pidginResultQuotes.medium.length)];
      } else {
        pidginQuote = pidginResultQuotes.low[Math.floor(Math.random() * pidginResultQuotes.low.length)];
      }

      // Call AI Feedback (optional, but good for detailed feedback)
      let aiMessage = "";
      try {
        const { data: fb } = await supabase.functions.invoke('generate-feedback', {
          body: { score: finalScore, total, avgTimePerQuestion: totalDuration / total }
        });
        if (fb) aiMessage = fb.message;
      } catch (e) { console.error("Feedback generation failed:", e); }

      const finalMotivationalMessage = `${pidginQuote} ${aiMessage}`;

      // Save to DB
      const { data: resultData, error: resultError } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quiz.quizId,
          user_id: user.id,
          score: finalScore,
          total,
          duration: totalDuration,
          level: percentage > 0.8 ? 'Advanced' : 'Novice',
          motivational_message: finalMotivationalMessage,
          results
        })
        .select()
        .single();

      if (resultError) throw resultError;

      const finalResult = {
        ...resultData,
        quizTitle: quiz.title,
        motivationalMessage: finalMotivationalMessage
      };

      localStorage.setItem("quizResult", JSON.stringify(finalResult));

      // Navigate to results page with state as backup/primary
      navigate("/user/quiz-result", { state: { result: finalResult } });

      if (onComplete) onComplete();

    } catch (err) {
      console.error("Quiz submission error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-electric-cyan"></div>
    </div>
  );

  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  const currentQ = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-space-dark text-white overflow-hidden relative flex flex-col">
      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      {/* 📊 Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-6 glass-card rounded-b-3xl mx-4 mt-2 border-t-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
              <span className="font-bold text-lg">{currentQuestionIndex + 1}/{quiz.questions.length}</span>
            </div>
            <svg className="absolute top-0 left-0 w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#00F5FF" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * ((currentQuestionIndex + 1) / quiz.questions.length))} className="transition-all duration-500" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Progress</span>
            <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-electric-cyan to-hot-magenta"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-hot-magenta">
            <Flame className={`w-6 h-6 ${streak > 2 ? 'animate-bounce' : ''}`} />
            <span className="font-bold text-xl">{streak}</span>
          </div>
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Clock className="w-6 h-6 text-electric-lime absolute" />
            <svg className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#39FF14" strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * (timer / 30))} className="transition-all duration-1000 linear" />
            </svg>
          </div>
        </div>
      </div>

      {/* 🃏 Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            {/* Retention Banner */}
            {currentQ.isRetention && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 p-4 rounded-xl mb-4 text-center font-bold flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Let's test you on "{currentQ.sourceQuizTitle}" whether you can still remember
              </motion.div>
            )}

            {/* Question Card */}
            <div className={`
                    relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl text-center mb-8
                    ${isAnswered && !isCorrect ? 'animate-shake border-red-500/50' : ''}
                    ${isAnswered && isCorrect ? 'border-electric-lime/50 shadow-[0_0_30px_rgba(57,255,20,0.3)]' : ''}
                `}>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                {currentQ.question}
              </h2>
              {isAnswered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${isCorrect ? 'bg-electric-lime/20 text-electric-lime' : 'bg-red-500/20 text-red-500'}`}
                >
                  {isCorrect ? <><CheckCircle className="w-5 h-5" /> Correct!</> : <><XCircle className="w-5 h-5" /> Wrong!</>}
                </motion.div>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => {
                const letter = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedOption === letter;
                const isCorrectOption = letter === currentQ.correctAnswer;

                let stateClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-electric-cyan/50";
                if (isAnswered) {
                  if (isCorrectOption) stateClass = "bg-electric-lime/20 border-electric-lime text-electric-lime shadow-[0_0_20px_rgba(57,255,20,0.3)]";
                  else if (isSelected && !isCorrectOption) stateClass = "bg-red-500/20 border-red-500 text-red-500";
                  else stateClass = "opacity-50 bg-black/20 border-transparent";
                }

                return (
                  <motion.button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(letter)}
                    whileHover={!isAnswered ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    className={`
                                    relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden
                                    ${stateClass}
                                `}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold border
                                        ${isAnswered && isCorrectOption ? 'bg-electric-lime text-black border-electric-lime' : 'bg-white/10 border-white/20 group-hover:border-electric-cyan'}
                                    `}>
                        {letter}
                      </div>
                      <span className="text-lg font-medium">{opt}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 💬 Pidgin Bubble */}
      <AnimatePresence>
        {showPidgin && (
          <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-20 right-10 bg-gradient-to-r from-hot-magenta to-purple-600 p-4 rounded-2xl rounded-br-none shadow-2xl z-50 max-w-xs"
          >
            <p className="text-white font-bold text-lg">"{pidginMessage}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
