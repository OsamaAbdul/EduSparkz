import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { FileUploadCard } from "../features/dashboard/components/FileUploadCard.jsx";
import { Chatbot } from "../features/dashboard/components/Chatbot.jsx";
import Quiz from "../pages/Quiz.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "../context/useContext.jsx";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export const StartQuiz = () => {
    const [quizId, setQuizId] = useState(null);
    const [quizTitle, setQuizTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [checkingLimit, setCheckingLimit] = useState(true);
    const [canTakeQuiz, setCanTakeQuiz] = useState(true);
    const [quizzesTaken, setQuizzesTaken] = useState(0);
    const location = useLocation();
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const checkLimit = async () => {
            if (!user) return;
            try {
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                const { count, error } = await supabase
                    .from('quiz_results')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('submitted_at', oneDayAgo);

                if (error) throw error;

                setQuizzesTaken(count || 0);

                // Get followed_socials status from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('followed_socials, plan')
                    .eq('id', user.id)
                    .single();

                const isFree = !profile?.plan || profile.plan.toLowerCase() === 'free';
                const hasFollowed = profile?.followed_socials || false;
                const dailyLimit = hasFollowed ? 15 : 3;

                if (isFree && (count || 0) >= dailyLimit) {
                    setCanTakeQuiz(false);
                } else {
                    setCanTakeQuiz(true);
                }
            } catch (error) {
                console.error("Error checking quiz limit:", error);
            } finally {
                setCheckingLimit(false);
            }
        };

        checkLimit();
    }, [user]);

    useEffect(() => {
        const { retakeQuizId, retakeQuizTitle, retentionFailed } = location.state || {};
        if (retakeQuizId) {
            if (retentionFailed) {
                toast.error("Retention Check Failed! You must retake this quiz to proceed.");
            }
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

    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-full space-y-4 w-full overflow-hidden">
                {loading ? (
                    quizId ? (
                        <Card className="w-full max-w-2xl mx-auto glass-card border-white/10">
                            <CardHeader>
                                <Skeleton className="h-6 w-1/2 bg-white/10" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-4 w-3/4 bg-white/10" />
                                <Skeleton className="h-10 w-full bg-white/10" />
                                <Skeleton className="h-10 w-full bg-white/10" />
                                <Skeleton className="h-10 w-full bg-white/10" />
                                <Skeleton className="h-10 w-1/4 bg-white/10" />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="w-full max-w-md mx-auto glass-card border-white/10">
                            <CardHeader>
                                <Skeleton className="h-6 w-2/3 bg-white/10" />
                                <Skeleton className="h-4 w-4/5 bg-white/10" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-10 w-full bg-white/10" />
                                <Skeleton className="h-10 w-1/2 mt-4 bg-white/10" />
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
                ) : checkingLimit ? (
                    <div className="w-full max-w-md mx-auto glass-card border-white/10 p-6 space-y-4">
                        <Skeleton className="h-8 w-3/4 bg-white/10 mx-auto" />
                        <Skeleton className="h-32 w-full bg-white/10" />
                    </div>
                ) : !canTakeQuiz ? (
                    <Card className="w-full max-w-lg mx-auto glass-card border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <CardHeader className="text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Daily Limit Reached</h2>
                            <p className="text-gray-400">
                                You've used your 3 free quizzes for today. Upgrade to Premium for unlimited access!
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="bg-white/5 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-300">Quizzes taken today: <span className="text-electric-cyan font-bold">{quizzesTaken}/{quizzesTaken >= 15 ? 15 : (quizzesTaken >= 3 ? (user?.followed_socials ? 15 : 3) : 3)}</span></p>
                                {!user?.followed_socials && user?.plan?.toLowerCase() !== 'premium' && (
                                    <p className="text-xs text-electric-cyan mt-2">
                                        💡 Tip: Follow us on socials to unlock 15 quizzes/day!
                                    </p>
                                )}
                            </div>
                            <Button
                                onClick={() => navigate('/pricing')}
                                className="w-full bg-gradient-to-r from-electric-cyan to-hot-magenta text-white font-bold py-6 text-lg shadow-lg hover:scale-105 transition-transform"
                            >
                                Upgrade Now
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="w-full">
                        <FileUploadCard
                            title="Upload PDF and Start Quizzing"
                            description="Upload a PDF to generate an engaging quiz"
                            accept="application/pdf"
                            onQuizGenerated={handleQuizGenerated}
                        />
                    </div>
                )}
            </div>
            <Chatbot />
        </DashboardLayout>
    );
};

export default StartQuiz;
