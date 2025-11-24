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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
            {/* <Header /> */}

            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA] mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your learning needs. No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative flex flex-col backdrop-blur-xl border transition-all duration-300 hover:shadow-xl
                ${plan.popular
                                    ? "bg-white/90 dark:bg-[#1E2D4C]/90 border-[#ACBDAA] shadow-lg scale-105 z-10"
                                    : "bg-white/70 dark:bg-[#1E2D4C]/60 border-[#ACBDAA]/30 hover:border-[#ACBDAA]/60"
                                }
              `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-[#ACBDAA] text-[#1E2D4C] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-[#1E2D4C] dark:text-white">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                                            <Check className="h-5 w-5 text-[#ACBDAA] mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className={`w-full py-6 text-lg font-medium transition-all duration-300
                    ${plan.popular
                                            ? "bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90"
                                            : "bg-[#1E2D4C] text-white dark:bg-[#ACBDAA]/10 dark:text-[#ACBDAA] hover:bg-[#1E2D4C]/90 dark:hover:bg-[#ACBDAA]/20"
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
