import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Trophy, Users, Quote, Upload, FileText, Brain, Zap, Globe } from "lucide-react";
import { useUser } from "../context/useContext.jsx";
import { supabase } from "../lib/supabase";

const PIDGIN_QUOTES = [
  "No gree for anybody, read your book!",
  "Success no be beans, you gats work am.",
  "Who read book no go carry last.",
  "Knowledge na power, make you grab am.",
  "School sweet but na exam make am bitter, prepare well!",
  "Read today, lead tomorrow. No be joke!",
  "If you no read, you go red. Oya study!",
];

export const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(PIDGIN_QUOTES[Math.floor(Math.random() * PIDGIN_QUOTES.length)]);
  }, []);

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats", user?.id],
    queryFn: async () => {
      const [materials, quizzes, leaderboard, profile] = await Promise.all([
        supabase.from("materials").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_results").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("quiz_results").select("score, total").eq("user_id", user.id),
        supabase.from("profiles").select("xp, current_streak, level").eq("id", user.id).single()
      ]);

      const totalScore = leaderboard.data?.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) || 0;
      const avgScore = leaderboard.data?.length ? (totalScore / leaderboard.data.length).toFixed(1) : 0;

      return {
        materialsCount: materials.count || 0,
        quizzesCount: quizzes.count || 0,
        avgScore: avgScore,
        xp: profile.data?.xp || 0,
        streak: profile.data?.current_streak || 0,
        level: profile.data?.level || 1
      };
    },
    enabled: !!user?.id,
  });

  // Fetch Suggested Users
  const { data: suggestedUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["suggestedUsers", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .neq("id", user.id)
        .limit(3);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-electric-cyan">{user?.user_metadata?.full_name || "Scholar"}</span>
            </h1>
            <p className="text-gray-400">
              Your <span className="text-hot-magenta font-bold">Knowledge Galaxy</span> is expanding.
            </p>
          </div>
          <Button
            onClick={() => navigate("/user/start-quiz")}
            className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
          >
            <Brain className="mr-2 h-4 w-4" /> Start New Quiz
          </Button>
        </motion.div>

        {/* 🌍 Knowledge Galaxy / Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Central Galaxy Visual (Simulated) */}
          <div className="sm:col-span-2 lg:col-span-4 relative h-48 rounded-3xl overflow-hidden glass-card flex items-center justify-center mb-4 group">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/10 to-hot-magenta/10" />
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center"
              >
                <Globe className="w-12 h-12 text-electric-cyan" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">Level {stats?.level || 1} Explorer</h3>
              <div className="w-64 h-2 bg-white/10 rounded-full mx-auto mt-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats?.xp % 1000) / 10}%` }}
                  className="h-full bg-gradient-to-r from-electric-cyan to-hot-magenta"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{stats?.xp || 0} XP / 1000 XP to Next Level</p>
            </div>
          </div>

          {/* Stat Cards */}
          {[
            { label: "Materials", val: stats?.materialsCount, icon: FileText, color: "text-electric-cyan", bg: "bg-electric-cyan/20", border: "border-electric-cyan/50" },
            { label: "Quizzes", val: stats?.quizzesCount, icon: Brain, color: "text-hot-magenta", bg: "bg-hot-magenta/20", border: "border-hot-magenta/50" },
            { label: "Avg Score", val: `${stats?.avgScore}%`, icon: Trophy, color: "text-electric-lime", bg: "bg-electric-lime/20", border: "border-electric-lime/50" },
            { label: "Streak", val: stats?.streak, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/20", border: "border-orange-500/50" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center relative group overflow-visible"
            >
              {/* Circular Icon Container */}
              <div className={`w-24 h-24 rounded-full ${stat.bg} ${stat.border} border-2 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />

                {/* Bubble Data Badge */}
                <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full ${stat.bg} ${stat.border} border flex items-center justify-center shadow-lg backdrop-blur-md z-10`}>
                  <span className={`text-xs font-bold ${stat.color}`}>
                    {statsLoading ? <Skeleton className="h-3 w-3 bg-white/20 rounded-full" /> : stat.val}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mt-4">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote of the Day */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="h-full glass-card p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-cyan to-hot-magenta" />
              <Quote className="h-8 w-8 text-white/20 mb-4" />
              <blockquote className="text-2xl md:text-3xl font-bold italic text-white text-center leading-relaxed">
                "{quote}"
              </blockquote>
            </div>
          </motion.div>

          {/* Connect with Others */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="h-full glass-card p-6 rounded-3xl">
              <h3 className="flex items-center gap-2 text-white font-bold mb-6">
                <Users className="h-5 w-5 text-electric-cyan" /> Top Learners
              </h3>
              <div className="space-y-4">
                {usersLoading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full bg-white/10" />
                      </div>
                    </div>
                  ))
                ) : suggestedUsers?.length > 0 ? (
                  suggestedUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-electric-cyan to-hot-magenta p-[2px]">
                          <div className="h-full w-full rounded-full bg-space-dark flex items-center justify-center text-white font-bold text-sm">
                            {u.full_name?.[0] || u.username?.[0] || "U"}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{u.full_name || u.username}</p>
                          <p className="text-xs text-gray-400">Level {Math.floor(Math.random() * 10) + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No other users found yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Upload", icon: Upload, path: "/user/start-quiz" },
              { label: "Library", icon: FileText, path: "/user/materials" },
              { label: "Ranks", icon: Trophy, path: "/user/leaderboard" },
              { label: "History", icon: BookOpen, path: "/user/history" }
            ].map((action, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-electric-cyan/50 text-white w-full rounded-2xl transition-all"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="h-6 w-6 text-electric-cyan" />
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
