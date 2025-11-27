import { motion } from "framer-motion";

export const ShowcaseSection = () => {
    return (
        <section className="relative py-20 overflow-hidden bg-space-dark">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-cyan/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hot-magenta/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">
                            Instant Feedback
                        </span>{" "}
                        That Hits Home
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Get detailed analysis and culturally relevant motivation (Pidgin & more) that keeps you going.
                        See exactly where you stand and how to improve.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative max-w-5xl mx-auto perspective-1000"
                >
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-electric-cyan via-purple-500 to-hot-magenta rounded-2xl blur-lg opacity-40 animate-pulse" />

                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 backdrop-blur-sm">
                        <img
                            src="/quiz-results-preview.png"
                            alt="Quiz Results Preview with Pidgin Motivation"
                            className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700"
                        />

                        {/* Overlay Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-space-dark/50 to-transparent pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
