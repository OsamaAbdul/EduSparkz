import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Lock, Mail, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import logoIcon from "../../../public/edusparkz-logo.png";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            // Check if user is actually an admin
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profileError) throw profileError;

            if (profile.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error("Unauthorized access. Admin privileges required.");
            }

            toast.success("Welcome back, Admin!");
            navigate("/admin/dashboard");
        } catch (error) {
            toast.error(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-space-dark p-4 relative overflow-hidden">
            {/* 🌌 Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <Card className="w-full max-w-md glass-card border-red-500/20 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-600" />

                <CardHeader className="text-center space-y-2">
                    <div className="mb-6 flex justify-center">
                        <img
                            src={logoIcon}
                            alt="EduSparkz Logo"
                            className="h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">Admin Portal</CardTitle>
                    <CardDescription className="text-gray-400">Secure access for system administrators</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@edusparkz.com"
                                    className="pl-10 bg-white/5 border-white/10 text-white focus:border-red-500/50 focus:ring-red-500/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 bg-white/5 border-white/10 text-white focus:border-red-500/50 focus:ring-red-500/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-6 shadow-lg shadow-red-900/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Access Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
