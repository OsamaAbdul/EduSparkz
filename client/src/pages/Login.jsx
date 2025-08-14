import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, Mail, Eye, EyeOff, Brain } from "lucide-react";
import { toast } from "sonner";
import BackButton from '../components/landing/BackButton';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useUser } from '../context/useContext';
import { validatePassword } from '../utils/validatePassword';


const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.error || data.message || 'Login failed. Please try again.');
        return;
      }

      const userData = {
        token: data.token,
        name: data.user.name,
        email: data.user.email,
        id: data.user.id
      };

      localStorage.setItem('user', JSON.stringify(userData));
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
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />

      <BackButton />

      <div className="relative z-10 px-4 sm:px-6" style={{ width: '600px', maxWidth: '600px' }}>
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-white">
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
            </CardTitle>
           
            <p className="text-white text-center">Login and enjoy the App for free</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email or Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="identifier"
                    type="text"
                    placeholder="osamaabdul@dev.com or Osamaabdul"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    value={identifier}
                    disabled={loading}
                    onChange={(e) => setIdentifier(e.target.value)}
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && <PasswordStrengthMeter password={password} />}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold mt-4 py-6"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-400">
            Don’t have an account?&nbsp;
            <button
              className="text-cyan-400 hover:underline ml-1"
              type="button"
              onClick={() => navigate("/api/auth/register")}
            >
              Register
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
