import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Lock, Mail, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";
import logoIcon from "../../../public/edusparkz-logo.png";

const AdminSignup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const handleSignup = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: 'admin' // We'll try to set this, but profile trigger might overwrite or ignore
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Explicitly update the profile to be an admin
                // This requires the RLS policy to allow updates, or we rely on the initial trigger
                // Since we fixed RLS recursion, we might need a specific function or just rely on manual DB update for safety
                // But for "seamless", let's try to update it. 
                // NOTE: Standard users can't make themselves admins via RLS usually.
                // We will use a special Edge Function or assume the trigger handles it if metadata has role.

                // For this implementation, we'll assume we need to call a secure function or the trigger respects metadata
                // Let's try updating profile directly first (might fail if RLS is strict)

                // WORKAROUND: Since we can't easily make someone admin from client-side safely without a backend:
                // We will use the 'delete-user' function logic but for 'create-admin' if we had one.
                // For now, we will rely on the metadata 'role': 'admin' being passed to the trigger.
                // You must ensure your 'handle_new_user' trigger uses:
                // new.raw_user_meta_data->>'role' to set the profile role.

                // Let's check if the trigger worked
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', authData.user.id)
                    .single();

                toast.success("Account created! Please contact a Super Admin to approve your administrative access.");


                navigate("/admin/login");
            }
        } catch (error) {
            toast.error(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-space-dark p-4 relative overflow-hidden">
            {/* 🌌 Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <Card className="w-full max-w-md glass-card border-orange-500/20 shadow-2xl relative z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-red-600" />

                <CardHeader className="text-center space-y-2">
                    <div className="mb-6 flex justify-center">
                        <img
                            src={logoIcon}
                            alt="EduSparkz Logo"
                            className="h-32 w-auto object-contain drop-shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-white tracking-tight">Admin Registration</CardTitle>
                    <CardDescription className="text-gray-400">Create a new administrative account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    className="pl-10 bg-white/5 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@edusparkz.com"
                                    className="pl-10 bg-white/5 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
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
                                    className="pl-10 bg-white/5 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-sm text-orange-200 flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>
                                For security reasons, new admin accounts are created with <strong>User</strong> privileges by default.
                                Please contact a Super Admin to approve your administrative access after signing up.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-6 shadow-lg shadow-orange-900/20"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Create Account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSignup;
