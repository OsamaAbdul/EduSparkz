import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Eye, EyeOff, Star, Quote } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../context/useContext";
import { supabase } from "../lib/supabase";
import BackButton from "../features/landing/components/BackButton.jsx";
import logoIcon from "../assets/edusparkz-logo.png";
import { checkRateLimit, recordAttempt, clearRateLimit } from "../utils/rateLimit";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const { setUser } = useUser();

  useEffect(() => {
    const checkLimit = () => {
      const { blocked, remainingTime } = checkRateLimit("login");
      setIsBlocked(blocked);
      setRemainingTime(remainingTime);
    };

    checkLimit();
    const interval = setInterval(checkLimit, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Error connecting to the server");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { blocked, remainingTime } = checkRateLimit("login");
    if (blocked) {
      toast.error(`Too many attempts. Please try again in ${remainingTime} seconds.`);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (error) {
        recordAttempt("login");
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }

      clearRateLimit("login");

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const userData = {
        ...data.user,
        ...profile,
        token: data.session.access_token,
        name: profile?.full_name || data.user.user_metadata.full_name || data.user.email,
        email: data.user.email,
        id: data.user.id,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Login successful");

      if (profile?.role === 'admin' || profile?.role === 'instructor' || profile?.role === 'learner' || profile?.onboarding_completed) {
        let target = "/user/dashboard";
        if (profile?.role === 'admin') target = "/admin/dashboard";
        else if (profile?.role === 'instructor') target = "/instructor/dashboard";
        else if (profile?.role === 'learner') target = "/user/dashboard";

        setTimeout(() => navigate(target), 1000);
      } else {
        setTimeout(() => navigate("/user/onboarding"), 1000);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white flex flex-col md:grid lg:grid-cols-2">
      <BackButton />

      {/* Left Side: Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="text-center mb-10">
            <img
              src={logoIcon}
              alt="EduSparkz Logo"
              className="h-16 w-auto mx-auto mb-6 drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]"
            />
            <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back</h1>
            <p className="text-gray-400 font-medium">Continue your planetary learning journey</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-edu-cyan transition-colors" />
                <Input
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="eduSparkz@dev.com"
                  className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:border-edu-cyan/50 focus:ring-edu-cyan/20 transition-all text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Password</Label>
                <button
                  type="button"
                  onClick={() => navigate("/api/auth/forgot-password")}
                  className="text-xs text-edu-cyan hover:underline font-bold"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-edu-cyan transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 pr-11 bg-white/5 border-white/10 h-12 rounded-xl focus:border-edu-cyan/50 focus:ring-edu-cyan/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || isBlocked}
              className="w-full bg-edu-cyan text-space-dark hover:bg-edu-cyan/90 h-14 rounded-xl font-black text-lg shadow-[0_4px_20px_rgba(123,246,252,0.2)] hover:shadow-[0_4px_30px_rgba(123,246,252,0.4)] transition-all active:scale-[0.98]"
            >
              {loading ? "Signing In..." : isBlocked ? `Wait ${remainingTime}s` : "Sign In"}
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                <span className="bg-[#0a0a0a]/50 backdrop-blur-sm px-4 text-gray-500 rounded-full">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl font-bold transition-all"
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </Button>

            <p className="text-center text-gray-400 text-sm font-medium">
              First time here?{" "}
              <Link
                to="/api/auth/register"
                className="text-white hover:text-edu-cyan transition-colors underline font-bold"
              >
                Create Account
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Right Side: Marketing Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#0a0a0a] p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-edu-cyan/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl z-10"
        >


          <h2 className="text-6xl font-black tracking-tighter leading-[0.9] mb-8">
            Join thousands <br />
            <span className="text-gray-500">leveling up daily.</span>
          </h2>

          <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12 max-w-lg">
            From quick challenges to deep dives, EduSparkz's community of learners is growing together — one badge at a time.
          </p>


        </motion.div>
      </div>
    </div>
  );
};

export default Login;
