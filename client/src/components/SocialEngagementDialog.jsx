import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, CheckCircle2, Sparkles, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const SocialEngagementDialog = ({ isOpen, onOpenChange, userId, onBonusAwarded }) => {
    const [step, setStep] = useState(1); // 1: Initial, 2: Shared/Followed, 3: Success
    const [isVerifying, setIsVerifying] = useState(false);

    const handleSocialAction = (platform) => {
        const urls = {
            instagram: "https://instagram.com/edusparkz",
            twitter: "https://twitter.com/edusparkz"
        };
        window.open(urls[platform], "_blank");
        setStep(2);
    };

    const verifyEngagement = async () => {
        setIsVerifying(true);
        try {
            // In a real app, you might call an API to verify, but for now, we'll use a mocked delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const today = new Date().toISOString().split('T')[0];

            const { error } = await supabase
                .from('profiles')
                .update({ last_social_engagement_date: today })
                .eq('id', userId);

            if (error) throw error;

            setStep(3);
            toast.success("Bonus unlocked! +10 extra chats for today.");
            if (onBonusAwarded) onBonusAwarded();
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Failed to unlock bonus. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass-card border-white/10 bg-space-dark/95 text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-electric-cyan" />
                        Boost Your Daily Limit!
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Engage with our socials to get an instant <span className="text-electric-cyan font-bold">+10 chats</span> for today.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:border-hot-magenta transition-all group"
                                        onClick={() => handleSocialAction('instagram')}
                                    >
                                        <Instagram className="w-8 h-8 text-hot-magenta group-hover:scale-110 transition-transform" />
                                        <span>Follow Instagram</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5 hover:border-electric-cyan transition-all group"
                                        onClick={() => handleSocialAction('twitter')}
                                    >
                                        <Twitter className="w-8 h-8 text-electric-cyan group-hover:scale-110 transition-transform" />
                                        <span>Follow on X</span>
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center py-4 text-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-electric-cyan/10 flex items-center justify-center">
                                    <Share2 className="w-8 h-8 text-electric-cyan" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Did you follow us?</h3>
                                    <p className="text-sm text-gray-400">Click verify to claim your daily bonus!</p>
                                </div>
                                <Button
                                    className="w-full bg-electric-cyan text-space-dark font-bold hover:bg-electric-cyan/90"
                                    onClick={verifyEngagement}
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? "Verifying..." : "Verify & Claim Bonus"}
                                </Button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-4 text-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-green-500">Bonus Activated!</h3>
                                    <p className="text-sm text-gray-400">You now have 25 total chats for today.</p>
                                </div>
                                <Button
                                    className="w-full bg-white/10 border border-white/20 hover:bg-white/20"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Awesome!
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="sm:justify-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">EduSparkz Premium</p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
