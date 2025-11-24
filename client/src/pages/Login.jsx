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
// import BackButton from '../features/landing/components/BackButton'
// import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useUser } from "../context/useContext";
// import { validatePassword } from "../utils/validatePassword";
import Header from "../features/landing/components/Header.jsx";
import { supabase } from "../lib/supabase";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

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
      if (profile?.onboarding_completed) {
        setTimeout(() => navigate("/user/dashboard"), 1000);
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
      {/* <Header /> */}
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300 mt-10">
        {/* Subtle background accents */}
        {/* <div className="absolute top-10 left-10 w-24 h-24 bg-[#ACBDAA]/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-16 w-32 h-32 bg-[#1E2D4C]/10 rounded-full blur-2xl" /> */}



        <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
          <Card className="bg-white dark:bg-[#1E2D4C]/70 backdrop-blur-sm border border-gray-200 dark:border-[#ACBDAA]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-[#ACBDAA]">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#ACBDAA] dark:bg-[#ACBDAA]/20">
                    <Brain className="w-5 h-5 text-[#1E2D4C] dark:text-[#ACBDAA]" />
                  </div>
                  <span className="text-xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">
                    EduSparkz
                  </span>
                </div>
              </CardTitle>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Login to continue your learning journey
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Identifier */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="identifier"
                      type="email"
                      placeholder="osamaabdul@dev.com"
                      className="pl-10 bg-white dark:bg-[#0D1117]/50 border-gray-300 dark:border-[#ACBDAA]/20 text-gray-900 dark:text-white placeholder:text-gray-400"
                      value={identifier}
                      disabled={loading}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-white dark:bg-[#0D1117]/50 border-gray-300 dark:border-[#ACBDAA]/20 text-gray-900 dark:text-white placeholder:text-gray-400"
                      value={password}
                      disabled={loading}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-white"
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
                  className="w-full bg-[#1E2D4C] dark:bg-[#ACBDAA] text-white dark:text-[#1E2D4C] hover:opacity-90 py-6 font-medium"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#1E2D4C] px-2 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 dark:border-[#ACBDAA]/30 hover:bg-gray-50 dark:hover:bg-[#ACBDAA]/10 text-gray-700 dark:text-[#ACBDAA]"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                          redirectTo: `${window.location.origin}/user/dashboard`,
                        },
                      });
                      if (error) throw error;
                    } catch (err) {
                      toast.error("Error connecting to Google");
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                  Sign in with Google
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center text-sm text-gray-500 dark:text-gray-400">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/api/auth/register")}
                className="text-[#1E2D4C] dark:text-[#ACBDAA] hover:underline ml-1"
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
