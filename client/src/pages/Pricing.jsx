import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "../layouts/Header"

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "₦0",
            description: "Perfect for getting started",
            features: [
                "5 Quizzes per day",
                "Basic PDF processing",
                "Standard support",
                "Access to community",
            ],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Pro",
            price: "₦1,000",
            period: "/month",
            description: "For serious learners",
            features: [
                "Unlimited Quizzes",
                "Advanced AI models",
                "Priority processing",
                "Detailed analytics",
                "Export to PDF",
            ],
            cta: "Upgrade to Pro",
            popular: true,
        },
        {
            name: "Team",
            price: "₦2,000",
            period: "/month",
            description: "For study groups & classrooms",
            features: [
                "Everything in Pro",
                "Team collaboration",
                "Admin dashboard",
                "Custom branding",
                "API access",
            ],
            cta: "Contact Sales",
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-space-dark transition-colors duration-300 relative overflow-hidden">
            {/* 🌌 Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* <Header /> */}

            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your learning needs. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative flex flex-col backdrop-blur-xl border transition-all duration-300 hover:shadow-xl glass-card
                ${plan.popular
                                    ? "bg-white/10 border-electric-cyan shadow-[0_0_30px_rgba(0,245,255,0.2)] scale-105 z-10"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                                }
              `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-electric-cyan text-space-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-white">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-white">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-gray-400 ml-1">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-300">
                                            <Check className="h-5 w-5 text-electric-cyan mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className={`w-full py-6 text-lg font-medium transition-all duration-300
                    ${plan.popular
                                            ? "bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold"
                                            : "bg-white/10 text-white hover:bg-white/20"
                                        }
                  `}
                                >
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Pricing;
