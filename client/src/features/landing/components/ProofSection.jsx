import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const ProofSection = () => {
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-electric-cyan text-sm font-medium border-electric-cyan/30 mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>See EduSparkz in Action</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">AI Tutor</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Experience real-time interaction with your study materials. Ask questions, get summaries, and master any topic instantly.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-5xl mx-auto"
                >
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-electric-cyan to-hot-magenta opacity-30 blur-2xl rounded-[2rem]" />

                    {/* Image Container */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-space-dark/50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 via-transparent to-transparent z-10 pointer-events-none" />
                        <img
                            src="/ai-tutor-proof.png"
                            alt="EduSparkz AI Tutor Interface"
                            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700"
                        />
                    </div>

                    {/* Floating Badge */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 glass-card p-4 rounded-xl border-electric-cyan/30 shadow-lg z-20 hidden md:block"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-white font-bold">AI Online & Ready</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
