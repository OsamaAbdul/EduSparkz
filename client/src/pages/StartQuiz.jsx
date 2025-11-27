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

export const StartQuiz = () => {
    const [quizId, setQuizId] = useState(null);
    const [quizTitle, setQuizTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();

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
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 w-full">
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
                ) : (
                    <div className="w-full px-0">
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
