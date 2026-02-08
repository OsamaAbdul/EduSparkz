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
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import logoIcon from "../../public/edusparkz-logo.png";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/api/auth/update-password`,
            });

            if (error) {
                toast.error(error.message || "Failed to send reset email.");
                return;
            }

            toast.success("Password reset email sent! Check your inbox.");
            // Optional: Navigate back to login after a delay
            setTimeout(() => navigate("/api/auth/login"), 3000);
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error("An unexpected error occurred.");
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

                <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
                    <Card className="glass-card border-white/10 shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-semibold text-white">
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src={logoIcon}
                                        alt="EduSparkz Logo"
                                        className="h-32 w-auto object-contain"
                                    />
                                </div>
                                <div className="text-xl">Reset Password</div>
                            </CardTitle>
                            <p className="text-center text-gray-400 text-sm">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="osamaabdul@dev.com"
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan/50 focus:ring-electric-cyan/20"
                                            value={email}
                                            disabled={loading}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold py-6 shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
                                    disabled={loading}
                                >
                                    {loading ? "Sending Link..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => navigate("/api/auth/login")}
                                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
