import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ClipboardList,
    Clock,
    Trophy,
    CheckCircle,
    PlayCircle,
    AlertCircle
} from "lucide-react";
import { useUser } from "../../context/useContext.jsx";
import { supabase } from "../../lib/supabase";

const LearnerDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    // Fetch Assigned Quizzes for this Learner
    const { data: assignments, isLoading } = useQuery({
        queryKey: ["learnerAssignments", user?.id],
        queryFn: async () => {
            // 1. Get class IDs the user is enrolled in
            const { data: enrollments } = await supabase
                .from("class_enrollments")
                .select("class_id")
                .eq("user_id", user.id);

            if (!enrollments || enrollments.length === 0) return [];

            const classIds = enrollments.map(e => e.class_id);

            // 2. Get assignments for those classes
            const { data: assignments, error } = await supabase
                .from("quiz_assignments")
                .select(`
                    *,
                    quizzes (title, questions),
                    classes (name),
                    quiz_results (*)
                `)
                .in("class_id", classIds)
                .order("end_time", { ascending: true });

            if (error) throw error;

            // Filter results to only include current user's results
            return assignments.map(as => {
                const userResult = as.quiz_results?.find(r => r.user_id === user.id) || null;
                return {
                    ...as,
                    userResult: userResult ? {
                        ...userResult,
                        quizTitle: as.quizzes?.title // Ensure title is available for results page
                    } : null
                };
            });
        },
        enabled: !!user?.id,
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <DashboardLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        My <span className="text-hot-magenta">Learning Hub</span>
                    </h1>
                    <p className="text-gray-400">View and take quizzes assigned by your instructors.</p>
                </motion.div>

                {/* Assignments Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-64 glass-card rounded-3xl animate-pulse bg-white/5" />)
                    ) : assignments?.length > 0 ? (
                        assignments.map((as) => {
                            const now = new Date();
                            const start = new Date(as.start_time);
                            const end = new Date(as.end_time);
                            const isExpired = now > end;
                            const isFuture = now < start;
                            const isCompleted = !!as.userResult;
                            const isActive = !isExpired && !isFuture && !isCompleted;

                            return (
                                <motion.div
                                    key={as.id}
                                    variants={itemVariants}
                                    className={`glass-card p-6 rounded-3xl border transition-all flex flex-col justify-between ${isActive ? 'border-electric-cyan/30 hover:border-electric-cyan/60' : 'border-white/10 opacity-80'
                                        }`}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${isCompleted ? 'text-green-500' : isExpired ? 'text-red-500' : 'text-electric-cyan'
                                                }`}>
                                                {isCompleted ? <CheckCircle className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                                {as.classes?.name}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-1">{as.quizzes?.title}</h3>

                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span>Deadline: {end.toLocaleString()}</span>
                                            </div>
                                            {isCompleted && (
                                                <div className="flex items-center gap-2 text-xs text-green-500 font-bold">
                                                    <Trophy className="w-3 h-3" />
                                                    <span>Score: {as.userResult.score}/{as.userResult.total}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        {isCompleted ? (
                                            <Button
                                                onClick={() => navigate("/user/quiz-result", { state: { result: as.userResult } })}
                                                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                            >
                                                View Result
                                            </Button>
                                        ) : isExpired ? (
                                            <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold py-2">
                                                <AlertCircle className="w-4 h-4" /> Missed Deadline
                                            </div>
                                        ) : isFuture ? (
                                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-bold py-2">
                                                <Clock className="w-4 h-4" /> Starts {start.toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => navigate(`/learner/dashboard/take-quiz/${as.quiz_id}/${as.id}`)}
                                                className="w-full bg-electric-cyan text-space-dark font-black shadow-[0_4px_20px_rgba(0,245,255,0.3)] hover:shadow-[0_4px_30px_rgba(0,245,255,0.5)] transition-all"
                                            >
                                                <PlayCircle className="mr-2 h-4 w-4" /> Take Quiz Now
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center glass-card rounded-3xl border border-dashed border-white/10">
                            <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No quizzes assigned to you at the moment.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </DashboardLayout>
    );
};

export default LearnerDashboard;
