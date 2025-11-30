import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { Loader2 } from "lucide-react";

export const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // getSession handles the URL hash parsing automatically
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Error getting session during callback:", error);
                    navigate("/api/auth/login");
                    return;
                }

                if (session) {
                    // Successful login
                    navigate("/user/dashboard");
                } else {
                    // No session found, maybe redirect to login
                    console.warn("No session found in callback");
                    navigate("/api/auth/login");
                }
            } catch (err) {
                console.error("Unexpected error in auth callback:", err);
                navigate("/api/auth/login");
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-space-dark flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 text-electric-cyan animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-300">Completing secure login...</p>
        </div>
    );
};