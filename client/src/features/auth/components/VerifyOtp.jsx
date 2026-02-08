// src/components/VerifyOtp.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import BackButton from '@/features/landing/components/BackButton.jsx';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";
import logoIcon from "@/assets/edusparkz-logo.png";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState(location.state?.identifier || '');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch email if identifier is a username
  useEffect(() => {
    const fetchEmail = async () => {
      if (!identifier) return;

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      if (isEmail) {
        setEmail(identifier);
        return;
      }

      if (!isEmail) {
        setError('Please enter your email address for verification.');
      }
    };

    fetchEmail();
  }, [identifier]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup'
      });

      if (error) throw error;

      setSuccess('Verification successful!');
      toast.success('Verification successful!');
      setTimeout(() => navigate('/api/auth/login'), 2000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Please provide a valid email to resend OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast.success('OTP resent successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden flex items-center justify-center p-4">
      {/* 🌌 Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <BackButton />

      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-6 flex justify-center">
              <img
                src={logoIcon}
                alt="EduSparkz Logo"
                className="h-32 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Verify OTP</CardTitle>
            <CardDescription className="text-gray-400">
              {email
                ? `Enter the OTP sent to ${email}.`
                : 'Enter the OTP sent to your registered email.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Input
                    id="identifier"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIdentifier(e.target.value);
                    }}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-gray-300">OTP</Label>
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your OTP"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                    required
                  />
                  <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold py-6 shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-400 text-sm">
                Didn't receive an OTP?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading || !email}
                  className="text-electric-cyan hover:text-electric-cyan/80 font-semibold underline disabled:opacity-50 transition-colors"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;