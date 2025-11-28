import { motion } from "framer-motion";

export const LeaderboardShowcaseSection = () => {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            Compete & {" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">
                                Climb the Ranks
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Join the community of learners. Earn XP, maintain streaks, and see your name on the global leaderboard. Learning is more fun when it's a game!
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                    🏆
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Earn XP</h4>
                                    <p className="text-sm text-gray-400">Get points for every correct answer.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-hot-magenta/20 flex items-center justify-center text-hot-magenta">
                                    🔥
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Maintain Streaks</h4>
                                    <p className="text-sm text-gray-400">Consistency is key to mastery.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Image Showcase */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,245,255,0.15)] bg-space-dark/50 backdrop-blur-sm">
                            <img
                                src="/leaderboard-preview.png"
                                alt="Leaderboard Preview"
                                className="w-full h-auto object-cover"
                            />

                            {/* Glass Overlay Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Decorative Elements behind image */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-electric-cyan/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-hot-magenta/20 rounded-full blur-3xl animate-pulse delay-1000" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
