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
import BackButton from "../components/landing/BackButton";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useUser } from "../context/useContext";
import { validatePassword } from "../utils/validatePassword";
import Header from "../components/landing/Header";

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 403 && data.message.includes("not activated")) {
          toast.warning("Your account is not activated. Please verify your OTP.");
          setTimeout(
            () => navigate("/api/auth/verify-otp", { state: { identifier } }),
            2000
          );
          return;
        }

        toast.error(data.error || data.message || "Login failed. Please try again.");
        return;
      }

      const userData = {
        token: data.token,
        name: data.user.name,
        email: data.user.email,
        id: data.user.id,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success(data.message || "Login successful");
      setTimeout(() => navigate("/user/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300 mt-10">
      {/* Subtle background accents */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#ACBDAA]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-16 w-32 h-32 bg-[#1E2D4C]/10 rounded-full blur-2xl" />

      

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
                  Email or Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="identifier"
                    type="text"
                    placeholder="osamaabdul@dev.com or Osamaabdul"
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
                {password && <PasswordStrengthMeter password={password} />}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1E2D4C] dark:bg-[#ACBDAA] text-white dark:text-[#1E2D4C] hover:opacity-90 py-6 font-medium"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
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
