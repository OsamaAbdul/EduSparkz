import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Brain } from "lucide-react";
import BackButton from '../components/landing/BackButton';
import { toast } from 'sonner';
import { useUser } from '../context/useContext';
import { validatePassword } from '../utils/validatePassword';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      toast.error(message);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.token || !data.user) {
        toast.error(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      toast.success("Account created successfully!");
      navigate("/api/auth/login");
    } catch (error) {
      console.error("❌ Registration error:", error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      {/* Blobs */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />

      <BackButton />

      <div className="relative z-10 px-4 sm:px-6" style={{ width: '600px', maxWidth: '600px' }}>
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader className="text-center">
             <div className="mb-6 pt-4 text-center">
                          <div className="flex items-center text-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            EduSparkz
                          </span>
                        </div>
                        </div>
            <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
            
            <CardDescription className="text-gray-400">Join us and start your journey today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="username"
                    type="text"
                    value={formData.username}
                    disabled={loading}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={loading}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    placeholder="**********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && <PasswordStrengthMeter password={formData.password} />}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
              >
                {loading ? "Creating your account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link to="/api/auth/login" className="text-purple-400 hover:text-purple-300 underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
