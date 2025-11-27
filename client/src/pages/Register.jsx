
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Lock, Mail, User, Brain, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import BackButton from "../features/landing/components/BackButton.jsx";
import PasswordStrengthMeter from "../features/auth/components/PasswordStrengthMeter";
import { supabase } from "../lib/supabase";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
            full_name: username, // Using username as full_name for now
          },
        },
      });

      if (error) throw error;

      toast.success("Registration successful! Please login.");

      // Optional: Navigate to login or a verification pending page
      setTimeout(() => navigate("/api/auth/login"), 2000);

    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-space-dark text-white">
        {/* 🌌 Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <BackButton />
        <div className="relative z-10 px-4 sm:px-6 w-full max-w-md">
          <Card className="glass-card border-white/10 shadow-2xl">
            <CardHeader className="text-center">
              {/* Logo */}
              <div className="mb-6 pt-4 text-center flex justify-center items-center space-x-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-electric-cyan to-hot-magenta p-[1px]">
                  <div className="w-full h-full bg-space-dark rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-electric-cyan" />
                  </div>
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-cyan to-hot-magenta">
                  EduSparkz
                </span>
              </div>

              <CardTitle className="text-2xl font-bold text-white">Register</CardTitle>
              <CardDescription className="text-gray-400">
                Create a new account to start your learning journey.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Top 2 Inputs: Email + Username */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">
                      Username
                    </Label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && <PasswordStrengthMeter password={password} />}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold py-6 shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>

            </CardContent>

            <CardFooter className="flex justify-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/api/auth/login"
                className="ml-1 text-electric-cyan hover:text-hot-magenta hover:underline transition-colors"
              >
                Log in
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Register;
