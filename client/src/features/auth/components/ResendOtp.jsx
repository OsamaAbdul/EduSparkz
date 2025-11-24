// src/components/ResendOtp.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Brain, Mail } from "lucide-react";
import BackButton from '@/features/landing/components/BackButton';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";

export const ResendOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setSuccess('OTP resent successfully!');
      toast.success('OTP resent successfully!');
      setTimeout(() => navigate('/api/auth/verify-otp', { state: { identifier: email } }), 2000); // Redirect to Verify OTP
    } catch (err) {
      setError(err.message);
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
            <CardTitle className="text-2xl font-bold text-white">Resend OTP</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to receive a new OTP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={false}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                {isLoading ? 'Resending...' : 'Resend OTP'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Back to{' '}
                <Link to="/api/auth/verify-otp" state={{ identifier: email }} className="text-purple-400 hover:text-purple-300 underline">
                  Verify OTP
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResendOtp;