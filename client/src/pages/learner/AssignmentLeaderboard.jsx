import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout.jsx";
import { supabase } from "../../lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Clock, ArrowLeft, Medal, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../../context/useContext.jsx";

const AssignmentLeaderboard = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    const { data: assignmentData, isLoading: assignmentLoading } = useQuery({
        queryKey: ["assignmentInfo", assignmentId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("quiz_assignments")
                .select(`
                    *,
                    quizzes (title),
                    classes (name)
                `)
                .eq("id", assignmentId)
                .single();
            if (error) throw error;
            return data;
        },
    });

    const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
        queryKey: ["assignmentLeaderboard", assignmentId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("quiz_results")
                .select(`
                    id,
                    score,
                    total,
                    duration,
                    submitted_at,
                    profiles (full_name, avatar_url, username)
                `)
                .eq("assignment_id", assignmentId)
                .order("score", { ascending: false })
                .order("duration", { ascending: true });

            if (error) throw error;
            return data || [];
        },
    });

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

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
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="text-gray-400 hover:text-white rounded-full"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Class <span className="text-electric-cyan">Leaderboard</span>
                        </h1>
                        {assignmentLoading ? (
                            <Skeleton className="h-4 w-48 bg-white/5 mt-2" />
                        ) : (
                            <p className="text-gray-400">
                                {assignmentData?.quizzes?.title} • {assignmentData?.classes?.name}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Top 3 Podium (Optional: Simplified list for now) */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card rounded-[2.5rem] border border-white/10 overflow-hidden"
                >
                    <div className="grid grid-cols-12 gap-4 p-6 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                        <div className="col-span-2 text-center">RANK</div>
                        <div className="col-span-6 md:col-span-4">LEARNER</div>
                        <div className="col-span-2 text-right">SCORE</div>
                        <div className="hidden md:block col-span-2 text-right">TIME</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {leaderboardLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="p-6 md:p-8"><Skeleton className="h-12 w-full bg-white/5 rounded-xl" /></div>
                            ))
                        ) : leaderboard?.length > 0 ? (
                            leaderboard.map((entry, index) => {
                                const isTopThree = index < 3;
                                const MedalIcon = index === 0 ? Trophy : index === 1 ? Medal : index === 2 ? Medal : null;
                                const medalColor = index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : "text-orange-500";

                                return (
                                    <motion.div
                                        key={entry.id}
                                        variants={itemVariants}
                                        className={`grid grid-cols-12 gap-4 p-6 md:p-8 items-center transition-all group ${
                                            entry.profiles?.username === user?.username ? 'bg-electric-cyan/10 border-electric-cyan/50 border-2 rounded-2xl' : 'hover:bg-white/5 border-transparent'
                                        }`}
                                    >
                                        <div className="col-span-2 flex justify-center items-center">
                                            {isTopThree ? (
                                                <div className="relative">
                                                    <MedalIcon className={`w-8 h-8 ${medalColor}`} />
                                                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-space-dark mt-1">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="font-black text-white/20 text-xl italic">#{index + 1}</span>
                                            )}
                                        </div>
                                        <div className="col-span-6 md:col-span-4 flex items-center gap-4">
                                            <Avatar className="w-10 h-10 border border-white/10">
                                                <AvatarImage src={entry.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.profiles?.username}`} />
                                                <AvatarFallback className="bg-space-dark text-white font-bold">{getInitials(entry.profiles?.full_name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col truncate">
                                                <span className="font-bold text-white group-hover:text-electric-cyan transition-colors truncate">
                                                    {entry.profiles?.full_name || entry.profiles?.username}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xl font-black text-white">{entry.score}/{entry.total}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">Points</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:block col-span-2 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="font-medium">{entry.duration}s</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-20 text-center text-gray-500 italic">
                                No results submitted for this assignment yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
};

export default AssignmentLeaderboard;
