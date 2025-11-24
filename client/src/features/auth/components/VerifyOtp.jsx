// src/components/VerifyOtp.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Brain, Mail } from "lucide-react";
import BackButton from '@/features/landing/components/BackButton.jsx';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";

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

      // If identifier is a username, we cannot easily fetch email from Supabase client-side for security.
      // For now, we assume identifier is email or we ask user to enter email.
      // Or we could query the profiles table if we allow public read access to emails (bad idea).
      // Let's assume identifier MUST be email for OTP verification in this new flow,
      // or we rely on the user knowing their email.
      // If the previous flow passed username, we might be stuck.
      // However, since we updated Login/Register to prioritize Email, we should encourage Email usage.

      // For migration compatibility, if it looks like a username, we might warn the user.
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
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  EduSparkz
                </span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Verify OTP</CardTitle>
            <CardDescription className="text-gray-400">
              {email
                ? `Enter the OTP sent to ${email}.`
                : 'Enter the OTP sent to your registered email.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-white">Email</Label>
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
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-white">OTP</Label>
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your OTP"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                  <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              {error && (
                <div className="text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-6 text-lg"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Didn't receive an OTP?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading || !email}
                  className="text-purple-400 hover:text-purple-300 underline disabled:opacity-50"
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