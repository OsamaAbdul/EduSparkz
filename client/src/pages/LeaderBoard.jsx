import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trophy, Flame, Medal, ArrowLeft, Crown, Star, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leaderboardData = [], isLoading, error } = useQuery({
    queryKey: ["leaderboard-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, xp, streak')
        .order('xp', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  const filteredData = leaderboardData.filter(user =>
    (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const topThree = filteredData.slice(0, 3);
  const remainingUsers = filteredData.slice(3);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  };

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
      <div className="min-h-screen bg-space-dark relative overflow-hidden p-4 md:p-8">
        {/* 🌌 Cosmic Background Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none z-0" />
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-hot-magenta/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ x: -5 }} className="cursor-pointer">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/user/dashboard')}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-3">
                  Hall of <span className="text-electric-cyan">Mastery</span>
                  <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
                </h1>
                <p className="text-gray-400 mt-1 font-medium">The elite pioneers of the Knowledge Galaxy</p>
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Locate a pioneer..."
                className="pl-11 bg-white/5 border-white/10 text-white rounded-2xl h-12 focus:ring-electric-cyan transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* 🏆 Podium Section */}
          {!isLoading && topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end px-4">
              {/* 🥈 Second Place (Mobile: 2nd, Desktop: 1st Col) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="order-2 md:order-1 h-full"
              >
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center text-center relative border-hot-magenta/20 group hover:border-hot-magenta/40 transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 p-4">
                    <Medal className="w-8 h-8 text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  </div>
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-hot-magenta/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Avatar className="w-24 h-24 border-2 border-white/10 ring-4 ring-hot-magenta/20">
                      <AvatarImage src={topThree[1]?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1]?.username}`} />
                      <AvatarFallback className="bg-space-dark text-white text-xl">{getInitials(topThree[1]?.full_name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 truncate w-full">{topThree[1]?.full_name || topThree[1]?.username}</h3>
                  <div className="flex items-center gap-2 text-hot-magenta font-bold mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>2ND PLACE</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-2xl p-4 flex justify-around">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">XP</p>
                      <p className="text-lg font-black text-white">{topThree[1]?.xp || 0}</p>
                    </div>
                    <div className="w-[1px] bg-white/10" />
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">STREAK</p>
                      <p className="text-lg font-black text-white">{topThree[1]?.streak || 0}</p>
                    </div>
                  </div>
                </div>
              </motion.div>


              {/* 🥇 First Place (Featured) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                className="order-1 md:order-2 h-full z-20"
              >
                <div className="glass-card rounded-[3rem] p-10 flex flex-col items-center text-center relative border-electric-cyan/40 bg-white/10 shadow-[0_0_50px_rgba(0,245,255,0.15)] transform scale-105 group hover:-translate-y-4 transition-all duration-500">

                  {/* 🎯 THE FIXED CENTERED WRAPPER */}
                  <div className="relative mb-8 mt-4 flex items-center justify-center">
                    {/* The Crown Container */}
                    <motion.div
                      animate={{ y: [-4, 0, -4], rotate: [-3, 3, -3] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-8 z-30 pointer-events-none origin-bottom"
                    >
                      <Crown className="w-14 h-14 text-yellow-400 fill-yellow-400/20 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                    </motion.div>

                    {/* The Avatar */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-electric-cyan/30 blur-3xl rounded-full scale-150 animate-pulse" />
                      <Avatar className="w-32 h-32 border-4 border-electric-cyan ring-8 ring-electric-cyan/10">
                        <AvatarImage src={topThree[0]?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0]?.username}`} />
                        <AvatarFallback className="bg-space-dark text-white text-3xl font-black">
                          {getInitials(topThree[0]?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Rest of the card content */}
                  <h3 className="text-2xl font-black text-white mb-2 truncate w-full tracking-tight">
                    {topThree[0]?.full_name || topThree[0]?.username}
                  </h3>

                  {/* Gold theme update for Supreme Master to match crown */}
                  <div className="flex items-center gap-2 text-yellow-400 font-black mb-6 tracking-widest text-sm">
                    <Star className="w-5 h-5 fill-yellow-400" />
                    <span>SUPREME MASTER</span>
                    <Star className="w-5 h-5 fill-yellow-400" />
                  </div>

                  <div className="w-full bg-electric-cyan/10 rounded-[2rem] p-6 flex justify-around border border-electric-cyan/20">
                    <div className="text-center">
                      <p className="text-[10px] text-electric-cyan/60 font-black uppercase tracking-[0.2em]">TOTAL XP</p>
                      <p className="text-3xl font-black text-white">{topThree[0]?.xp || 0}</p>
                    </div>
                    <div className="w-[1px] bg-electric-cyan/20" />
                    <div className="text-center">
                      <p className="text-[10px] text-electric-cyan/60 font-black uppercase tracking-[0.2em]">STREAK</p>
                      <p className="text-3xl font-black text-white">{topThree[0]?.streak || 0}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 🥉 Third Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="order-3 md:order-3 h-full"
              >
                <div className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center text-center relative border-orange-500/20 group hover:border-orange-500/40 transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 p-4">
                    <Medal className="w-8 h-8 text-orange-600 drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]" />
                  </div>
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Avatar className="w-24 h-24 border-2 border-white/10 ring-4 ring-orange-500/20">
                      <AvatarImage src={topThree[2]?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2]?.username}`} />
                      <AvatarFallback className="bg-space-dark text-white text-xl">{getInitials(topThree[2]?.full_name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 truncate w-full">{topThree[2]?.full_name || topThree[2]?.username}</h3>
                  <div className="flex items-center gap-2 text-orange-500 font-bold mb-4">
                    <TrendingUp className="w-4 h-4" />
                    <span>3RD PLACE</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-2xl p-4 flex justify-around">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">XP</p>
                      <p className="text-lg font-black text-white">{topThree[2]?.xp || 0}</p>
                    </div>
                    <div className="w-[1px] bg-white/10" />
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">STREAK</p>
                      <p className="text-lg font-black text-white">{topThree[2]?.streak || 0}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 📋 Remaining Players List */}
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="grid grid-cols-12 gap-4 p-8 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-1">PORTRAIT</div>
              <div className="col-span-6 md:col-span-4">PIONEER</div>
              <div className="hidden md:block col-span-2 text-right">MASTER XP</div>
              <div className="col-span-4 md:col-span-4 text-right">CURRENT STREAK</div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-white/5"
            >
              {remainingUsers.map((user, index) => (
                <motion.div
                  key={user.username || index}
                  variants={itemVariants}
                  className="grid grid-cols-12 gap-4 p-6 md:p-8 items-center hover:bg-white/5 transition-all duration-300 group cursor-default"
                >
                  <div className="col-span-1 text-center font-black text-white/20 group-hover:text-electric-cyan transition-colors text-xl italic pr-2">
                    #{index + 4}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Avatar className="w-12 h-12 ring-2 ring-white/5 group-hover:ring-electric-cyan/30 transition-all">
                      <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                      <AvatarFallback className="bg-space-dark text-white font-bold">{getInitials(user.full_name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="col-span-6 md:col-span-4 flex flex-col">
                    <span className="font-bold text-white text-lg group-hover:text-electric-cyan transition-colors truncate">
                      {user.full_name || user.username}
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-tight">Level Scholar</span>
                  </div>
                  <div className="hidden md:block col-span-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xl font-black text-white">{user.xp || 0}</span>
                      <span className="text-[10px] font-bold text-gray-500">XP</span>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-black text-sm flex items-center gap-2">
                        <Flame className="w-4 h-4 fill-orange-500" />
                        {user.streak || 0} DAYS
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {remainingUsers.length === 0 && !isLoading && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="p-6 rounded-full bg-white/5">
                  <Sparkles className="w-12 h-12 text-gray-600" />
                </div>
                <p className="text-gray-500 font-medium">Seeking more pioneers in the galaxy...</p>
              </div>
            )}

            {isLoading && (
              <div className="p-20 flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      </div >
    </DashboardLayout >
  );
};

export default Leaderboard;
