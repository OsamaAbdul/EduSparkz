import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff, Brain } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../context/useContext";
import { supabase } from "../lib/supabase";
import BackButton from "../features/landing/components/BackButton.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();



  // handle google login

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

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }

      // Fetch profile to get onboarding status
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
      // setUser(userData); // Context updates automatically via onAuthStateChange
      toast.success("Login successful");

      // Redirect based on onboarding status
      if (profile?.role === 'admin' || profile?.onboarding_completed) {
        const target = profile?.role === 'admin' ? "/admin/dashboard" : "/user/dashboard";
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
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-space-dark text-white">
        {/* 🌌 Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <BackButton />

        <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
          <Card className="glass-card border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-white">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-electric-cyan to-hot-magenta p-[1px]">
                    <div className="w-full h-full bg-space-dark rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-electric-cyan" />
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-cyan to-hot-magenta">
                    EduSparkz
                  </span>
                </div>
              </CardTitle>
              <p className="text-center text-gray-400">
                Login to continue your learning journey
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Identifier */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-300"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      name="identifier"
                      type="email"
                      placeholder="osamaabdul@dev.com"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                      value={identifier}
                      disabled={loading}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => navigate("/api/auth/forgot-password")}
                      className="text-xs text-electric-cyan hover:text-hot-magenta hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                      value={password}
                      disabled={loading}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold py-6 shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-space-dark px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-electric-cyan transition-colors"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Sign in with Google
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center text-sm text-gray-400">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/api/auth/register")}
                className="text-electric-cyan hover:text-hot-magenta hover:underline ml-1 transition-colors"
              >
                Register
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
