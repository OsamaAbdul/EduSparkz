import React from "react";
import { Check, Star, Sparkles, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "../features/landing/components/Header";
import { FooterSection } from "../features/landing/components/FooterSection";

const Pricing = () => {
    const navigate = useNavigate();
    const plans = [
        {
            name: "Free",
            price: "₦0",
            description: "Essential tools for casual learners",
            icon: Zap,
            features: [
                "3 AI Quizzes per day",
                "15 Quizzes/day with Social Bonus",
                "5 Chats/day (Up to 15 with Social)",
                "Basic PDF processing",
                "Standard evaluation AI",
                "Community access"
            ],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Pro",
            price: "₦1,000",
            period: "/month",
            description: "Full power for serious mastery",
            icon: Star,
            features: [
                "Unlimited Quizzes",
                "GPT-4o Learning Models",
                "Priority AI processing",
                "Advanced analytics dashboard",
                "Export to PDF & Notion",
                "Voice-to-Quiz beta"
            ],
            cta: "Go Pro Now",
            popular: true,
        },
        {
            name: "Team",
            price: "₦2,000",
            period: "/month",
            description: "Scale learning for your group",
            icon: Shield,
            features: [
                "Everything in Pro",
                "Admin management panel",
                "Collaborative study rooms",
                "Custom organization badge",
                "Enterprise API access",
                "White-label assessments"
            ],
            cta: "Contact Team",
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-space-dark text-white font-sans selection:bg-edu-cyan/30 overflow-x-hidden">
            <Header />

            {/* 🌌 Atmospheric Architecture */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-edu-cyan/10 blur-[150px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-hot-magenta/5 blur-[120px] rounded-full" />
                <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
            </div>

            <main className="relative z-10 pt-48 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-edu-cyan/10 border border-edu-cyan/20 text-edu-cyan text-xs font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <Sparkles className="w-3 h-3 fill-edu-cyan" />
                        Investing in Knowledge
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-8"
                    >
                        Elevate Your <br />
                        <span className="text-gray-500">Intelligence.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Unlock the full potential of AI-driven education. Choose the plan that aligns with your ambition.
                    </motion.p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="relative h-full"
                        >
                            <div className={`
                                h-full flex flex-col p-8 md:p-10 rounded-[2.5rem] backdrop-blur-2xl border transition-all duration-500 group relative overflow-hidden
                                ${plan.popular
                                    ? "bg-white/[0.08] border-edu-cyan/40 shadow-[0_20px_60px_-15px_rgba(123,246,252,0.15)] ring-4 ring-edu-cyan/5"
                                    : "bg-white/[0.03] border-white/10 hover:border-white/20"}
                            `}>
                                {/* Background Shimmer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                {plan.popular && (
                                    <div className="absolute top-8 right-8">
                                        <div className="bg-edu-cyan text-space-dark text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-edu-cyan/20">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-colors duration-500
                                        ${plan.popular ? "bg-edu-cyan/20 border-edu-cyan/30 text-edu-cyan" : "bg-white/5 border-white/10 text-gray-400 group-hover:text-white"}`}>
                                        <plan.icon className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-3xl font-black tracking-tight mb-2">{plan.name}</h3>
                                    <p className="text-gray-400 font-medium mb-8 leading-tight">{plan.description}</p>

                                    <div className="flex items-baseline gap-1 mb-10">
                                        <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                                        {plan.period && <span className="text-gray-500 font-bold text-lg">{plan.period}</span>}
                                    </div>

                                    <ul className="space-y-4 mb-12 flex-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 group/item">
                                                <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-colors
                                                    ${plan.popular ? "bg-edu-cyan/10 text-edu-cyan" : "bg-white/5 text-gray-600 group-hover/item:text-white"}`}>
                                                    <Check className="h-3 w-3" strokeWidth={4} />
                                                </div>
                                                <span className="text-gray-300 font-medium tracking-tight text-[1.05rem] group-hover/item:text-white transition-colors">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => plan.cta === "Contact Sales" ? null : navigate("/api/auth/register")}
                                        className={`w-full py-7 text-lg font-black rounded-2xl transition-all duration-300 active:scale-[0.98]
                                            ${plan.popular
                                                ? "bg-edu-cyan text-space-dark hover:bg-edu-cyan/90 shadow-[0_10px_30px_-10px_rgba(123,246,252,0.4)]"
                                                : "bg-white/5 text-white hover:bg-white/10 border border-white/5 hover:border-white/10"}
                                        `}
                                    >
                                        {plan.cta}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Link / Trust Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-24 text-center"
                >
                    <p className="text-gray-500 font-bold flex items-center justify-center gap-2">
                        Trusted by thousands of students world wide
                    </p>
                </motion.div>
            </main>

            <FooterSection />

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.1; }
                    50% { transform: scale(1.1); opacity: 0.15; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Pricing;
