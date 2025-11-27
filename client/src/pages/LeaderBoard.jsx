import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trophy, Flame, Medal, ArrowLeft } from "lucide-react";
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
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  const filteredData = leaderboardData.filter(user =>
    (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const topThree = filteredData.slice(0, 3);
  const rest = filteredData.slice(3);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/user/dashboard')}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          </div>

          {/* Podium Section */}
          {topThree.length > 0 && (
            <div className="flex justify-center items-end gap-4 mb-12 min-h-[300px]">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <Avatar className="w-16 h-16 border-2 border-gray-400">
                      <AvatarImage src={topThree[1].avatar_url} />
                      <AvatarFallback>{getInitials(topThree[1].full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-3 -right-3 bg-gray-700 rounded-full p-1">
                      <Medal className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  <div className="bg-gray-800/80 rounded-t-2xl p-4 w-32 h-40 flex flex-col items-center justify-center text-center border-t-4 border-gray-400">
                    <p className="font-bold text-sm truncate w-full text-white">{topThree[1].full_name || topThree[1].username}</p>
                    <p className="text-xs text-gray-400">Intermediate</p>
                    <div className="mt-2 flex items-center gap-1 text-red-500 font-bold">
                      <Trophy className="w-3 h-3" /> {topThree[1].xp || 0} XP
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center z-10 -mx-2">
                  <div className="relative mb-2">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                      <div className="text-yellow-500 animate-bounce">
                        <Trophy className="w-8 h-8 fill-current" />
                      </div>
                    </div>
                    <Avatar className="w-24 h-24 border-4 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                      <AvatarImage src={topThree[0].avatar_url} />
                      <AvatarFallback>{getInitials(topThree[0].full_name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="bg-gradient-to-b from-green-500 to-green-600 rounded-t-2xl p-6 w-40 h-52 flex flex-col items-center justify-center text-center shadow-2xl transform scale-105">
                    <p className="font-bold text-base truncate w-full text-white">{topThree[0].full_name || topThree[0].username}</p>
                    <p className="text-xs text-green-100 mb-2">Advanced</p>
                    <div className="bg-black/20 rounded-full px-3 py-1 flex items-center gap-1 text-white font-bold">
                      <Trophy className="w-3 h-3" /> {topThree[0].xp || 0} XP
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <Avatar className="w-16 h-16 border-2 border-amber-700">
                      <AvatarImage src={topThree[2].avatar_url} />
                      <AvatarFallback>{getInitials(topThree[2].full_name)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-3 -right-3 bg-gray-700 rounded-full p-1">
                      <Medal className="w-4 h-4 text-amber-700" />
                    </div>
                  </div>
                  <div className="bg-gray-800/80 rounded-t-2xl p-4 w-32 h-32 flex flex-col items-center justify-center text-center border-t-4 border-amber-700">
                    <p className="font-bold text-sm truncate w-full text-white">{topThree[2].full_name || topThree[2].username}</p>
                    <p className="text-xs text-gray-400">Beginner</p>
                    <div className="mt-2 flex items-center gap-1 text-red-500 font-bold">
                      <Trophy className="w-3 h-3" /> {topThree[2].xp || 0} XP
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-300">Leaderboard</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-gray-900 border-gray-800 text-white focus:ring-electric-cyan"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* List Section */}
          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 text-gray-400 text-sm font-medium border-b border-gray-800">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-1 text-center">Avatar</div>
              <div className="col-span-5">Name</div>
              <div className="col-span-3 text-right">XP</div>
              <div className="col-span-2 text-right">Streak</div>
            </div>

            {rest.map((user, index) => (
              <div key={user.username || index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors border-b border-gray-800/50 last:border-0">
                <div className="col-span-1 text-center font-bold text-gray-500">
                  {index + 4}
                </div>
                <div className="col-span-1 flex justify-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="col-span-5 font-medium text-white truncate">
                  {user.full_name || user.username}
                </div>
                <div className="col-span-3 text-right text-red-500 font-bold flex items-center justify-end gap-1">
                  <Trophy className="w-3 h-3" /> {user.xp || 0} XP
                </div>
                <div className="col-span-2 text-right text-yellow-500 font-bold flex items-center justify-end gap-1">
                  <Flame className="w-3 h-3" /> {user.streak || 0} Days
                </div>
              </div>
            ))}

            {rest.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No other users found.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
