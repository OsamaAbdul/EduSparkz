import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Twitter, Github, Send, CheckCircle, Sparkles, ExternalLink, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const SocialProofSection = ({ user, onUpdate }) => {
    const [platform, setPlatform] = useState("github");
    const [handle, setHandle] = useState("");
    const [postId, setPostId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        const input = platform === 'github' ? handle : postId;
        if (!input.trim()) {
            toast.error(`Please provide your ${platform === 'github' ? 'GitHub handle' : 'Tweet ID/Link'}`);
            return;
        }

        let cleanPostId = postId;
        if (platform === 'twitter' && postId.includes('/status/')) {
            cleanPostId = postId.split('/status/')[1].split('?')[0];
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('verify-socials', {
                body: {
                    platform,
                    handle: platform === 'github' ? handle : undefined,
                    postId: platform === 'twitter' ? cleanPostId : undefined
                }
            });

            if (error) throw error;

            if (data.success) {
                toast.success(data.message);
                setSubmitted(true);
                if (onUpdate) onUpdate();
            } else {
                toast.error(data.message || "Verification failed. Please try again.");
            }
        } catch (error) {
            console.error("Error verifying social:", error);
            toast.error("Failed to verify. Please make sure you followed the instructions.");
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted || user?.followed_socials) return null;

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
                        Automated Limit Upgrade
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                        Connect your socials to unlock 15 daily limits instantly. No waiting for manual review!
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
                        <button
                            onClick={() => setPlatform("github")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${platform === 'github' ? 'bg-electric-cyan/20 text-electric-cyan' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </button>
                        <button
                            onClick={() => setPlatform("twitter")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${platform === 'twitter' ? 'bg-hot-magenta/20 text-hot-magenta' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Twitter className="w-4 h-4" />
                            Twitter (X)
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={platform}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Info className="w-4 h-4 text-electric-cyan" />
                                    Instructions
                                </h4>
                                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                                    {platform === 'github' ? (
                                        <>
                                            <li>Follow <strong>@edu-sparkz</strong> on GitHub</li>
                                            <li>Enter your GitHub handle below to verify</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Tweet about <strong>#EduSparkz</strong> mentioning <strong>@edu_sparkz</strong></li>
                                            <li>Paste the link to your tweet below</li>
                                        </>
                                    )}
                                </ul>
                                <a
                                    href={platform === 'github' ? "https://github.com/edu-sparkz" : "https://twitter.com/intent/tweet?text=Transforming%20my%20learning%20workflow%20with%20@edu_sparkz%20!%20%23EduSparkz%20%23AI%20#Learning"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-medium text-electric-cyan hover:underline"
                                >
                                    {platform === 'github' ? "Go to GitHub Profile" : "Post a Tweet Now"}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        {platform === 'github' ? 'GitHub Handle' : 'Tweet Link / ID'}
                                    </label>
                                    <Input
                                        value={platform === 'github' ? handle : postId}
                                        onChange={(e) => platform === 'github' ? setHandle(e.target.value) : setPostId(e.target.value)}
                                        placeholder={platform === 'github' ? "e.g. octocat" : "https://x.com/user/status/..."}
                                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan"
                                        disabled={isLoading}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full ${platform === 'github' ? 'bg-electric-cyan hover:bg-electric-cyan/80' : 'bg-hot-magenta hover:bg-hot-magenta/80'} text-white font-bold h-12 shadow-lg transition-all`}
                                >
                                    {isLoading ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                            <Send className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Verify & Upgrade
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
};
