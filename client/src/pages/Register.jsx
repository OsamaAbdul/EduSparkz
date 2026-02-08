import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Eye, EyeOff, Sparkles, Star, Quote } from "lucide-react";
import { toast } from "sonner";
import BackButton from "../features/landing/components/BackButton.jsx";
import PasswordStrengthMeter from "../features/auth/components/PasswordStrengthMeter";
import { supabase } from "../lib/supabase";
import logoIcon from "../assets/edusparkz-logo.png";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username,
            referral_code: referralCode,
          },
        },
      });

      if (error) throw error;

      toast.success("Registration successful! Please login.");
      setTimeout(() => navigate("/api/auth/login"), 2000);

    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
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
          <div className="text-center mb-8">
            <img
              src={logoIcon}
              alt="EduSparkz Logo"
              className="h-16 w-auto mx-auto mb-6 drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]"
            />
            <h1 className="text-3xl font-black tracking-tight mb-2">Create your account</h1>
            <p className="text-gray-400 font-medium">Let's get started, your AI tutor awaits</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-edu-cyan transition-colors" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Full Name"
                  className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:border-edu-cyan/50 focus:ring-edu-cyan/20 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-edu-cyan transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="pl-11 bg-white/5 border-white/10 h-12 rounded-xl focus:border-edu-cyan/50 focus:ring-edu-cyan/20 transition-all text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Referral Code (Optional)</Label>
              <Input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Referral Code"
                className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-edu-cyan/50 focus:ring-edu-cyan/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest pl-1">Password</Label>
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
              {password && <PasswordStrengthMeter password={password} />}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-edu-cyan text-space-dark hover:bg-edu-cyan/90 h-14 rounded-xl font-black text-lg shadow-[0_4px_20px_rgba(123,246,252,0.2)] hover:shadow-[0_4px_30px_rgba(123,246,252,0.4)] transition-all active:scale-[0.98]"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>

            <p className="text-center text-gray-400 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/api/auth/login"
                className="text-white hover:text-edu-cyan transition-colors underline font-bold"
              >
                Sign In
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

export default Register;
