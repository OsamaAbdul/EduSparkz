
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
import BackButton from "../components/landing/BackButton.jsx";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Header from "../components/landing/Header.jsx";

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
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || "Registration failed.");
      }

      toast.success(data.message);
      const identifier = email;
      setTimeout(
        () => navigate("/api/auth/verify-otp", { state: { identifier } }),
        2000
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
   <Header />
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300 mt-10">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ACBDAA]/10 via-transparent to-transparent dark:from-[#ACBDAA]/10" />


      <div className="relative z-10 px-4 sm:px-6 w-full max-w-md">
        <Card
          className="
            border border-[#ACBDAA]/30 shadow-lg backdrop-blur-xl
            bg-white/70 dark:bg-[#1E2D4C]/70 dark:border-[#ACBDAA]/20
            transition-colors
          "
        >
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="mb-6 pt-4 text-center flex justify-center items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#ACBDAA]/40 dark:bg-[#ACBDAA]/20">
                <Brain className="w-5 h-5 text-[#1E2D4C] dark:text-[#ACBDAA]" />
              </div>
              <span className="text-xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">
                EduSparkz
              </span>
            </div>

            <CardTitle className="text-2xl font-bold">Register</CardTitle>
            <CardDescription className="text-[#858585] dark:text-[#CECBBA]">
              Create a new account to start your learning journey.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
  {/* Top 2 Inputs: Email + Username */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Email */}
    <div className="space-y-2">
      <Label htmlFor="email" className="text-[#1E2D4C] dark:text-[#ACBDAA]">
        Email
      </Label>
      <div className="relative flex items-center">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-[#858585]" />
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="
            pl-10 bg-[#F9FAF9] border-[#ACBDAA]/30 text-[#1E2D4C]
            placeholder:text-[#858585]
            dark:bg-[#1E2D4C]/30 dark:border-[#ACBDAA]/30 dark:text-[#ACBDAA] 
            dark:placeholder:text-[#CECBBA]
          "
        />
      </div>
    </div>

    {/* Username */}
    <div className="space-y-2">
      <Label htmlFor="username" className="text-[#1E2D4C] dark:text-[#ACBDAA]">
        Username
      </Label>
      <div className="relative flex items-center">
        <User className="absolute left-3 top-3 h-4 w-4 text-[#858585]" />
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          className="
            pl-10 bg-[#F9FAF9] border-[#ACBDAA]/30 text-[#1E2D4C]
            placeholder:text-[#858585]
            dark:bg-[#1E2D4C]/30 dark:border-[#ACBDAA]/30 dark:text-[#ACBDAA] 
            dark:placeholder:text-[#CECBBA]
          "
        />
      </div>
    </div>
  </div>

  {/* Password */}
  <div className="space-y-2">
    <Label htmlFor="password" className="text-[#1E2D4C] dark:text-[#ACBDAA]">
      Password
    </Label>
    <div className="relative flex items-center">
      <Lock className="absolute left-3 top-3 h-4 w-4 text-[#858585]" />
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        className="
          pl-10 pr-10 bg-[#F9FAF9] border-[#ACBDAA]/30 text-[#1E2D4C]
          placeholder:text-[#858585]
          dark:bg-[#1E2D4C]/30 dark:border-[#ACBDAA]/30 dark:text-[#ACBDAA] 
          dark:placeholder:text-[#CECBBA]
        "
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3 text-[#858585] hover:text-[#1E2D4C] dark:hover:text-[#ACBDAA]"
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
    className="
      w-full py-6 text-lg font-semibold
      bg-[#1E2D4C] text-[#ACBDAA] hover:bg-[#858585]
      dark:bg-[#ACBDAA] dark:text-[#1E2D4C] dark:hover:bg-[#CECBBA]
      transition-colors
    "
  >
    {isLoading ? "Registering..." : "Register"}
  </Button>
</form>

          </CardContent>

          <CardFooter className="flex justify-center text-sm text-[#858585] dark:text-[#CECBBA]">
            Already have an account?{" "}
            <Link
              to="/api/auth/login"
              className="ml-1 text-[#1E2D4C] hover:underline dark:text-[#ACBDAA]"
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
