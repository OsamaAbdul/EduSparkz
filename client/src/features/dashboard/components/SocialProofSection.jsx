import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Twitter, Linkedin, Instagram, Github, Send, CheckCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const SocialProofSection = ({ user, onUpdate }) => {
    const [proof, setProof] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!proof.trim()) {
            toast.error("Please provide some proof (handle or link)");
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    social_proof_data: proof,
                    followed_socials: true // Auto-approving for now, or tagging for review
                })
                .eq("id", user.id);

            if (error) throw error;

            toast.success("Thank you! Your limits have been upgraded to 15 per day!");
            setSubmitted(true);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Error submitting proof:", error);
            toast.error("Failed to submit proof. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <Card className="glass-card border-electric-cyan/30 shadow-[0_0_20px_rgba(0,245,255,0.1)] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-hot-magenta/10 rounded-full blur-3xl -z-10" />
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-electric-cyan" />
                        Unlock 15 Quizzes & Chats Daily!
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                        Follow our social handles and provide proof to upgrade your free plan limits.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-4 items-center justify-center py-2">
                        <a href="https://twitter.com/edu_sparkz" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-electric-cyan transition-all">
                            <Twitter className="w-6 h-6 text-white group-hover:text-electric-cyan" />
                            <span className="text-xs text-gray-500">Twitter</span>
                        </a>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Proof of Engagement</label>
                            <Input
                                value={proof}
                                onChange={(e) => setProof(e.target.value)}
                                placeholder="Enter your handle or a link to your post..."
                                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan"
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-electric-cyan to-hot-magenta text-white font-bold h-12 shadow-lg hover:shadow-electric-cyan/20 transition-all"
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                    <Send className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Submit & Upgrade Now
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};
