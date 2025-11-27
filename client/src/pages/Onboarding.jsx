import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "../context/useContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { Brain, Target, BookOpen, Sparkles, CreditCard, Check } from "lucide-react";

const steps = [
    {
        id: "welcome",
        title: "Welcome to EduSparkz",
        description: "Let's personalize your learning experience.",
        icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    },
    {
        id: "goals",
        title: "What are your learning goals?",
        description: "Select all that apply.",
        icon: <Target className="w-8 h-8 text-electric-cyan" />,
    },
    {
        id: "style",
        title: "How do you learn best?",
        description: "Choose your preferred learning style.",
        icon: <Brain className="w-8 h-8 text-hot-magenta" />,
    },
    {
        id: "plan",
        title: "Choose your plan",
        description: "Select a plan that fits your needs.",
        icon: <CreditCard className="w-8 h-8 text-green-500" />,
    },
];

const learningGoals = [
    "Prepare for exams",
    "Learn a new skill",
    "Improve grades",
    "Professional development",
    "Just for fun",
    "Certification",
];

const learningStyles = [
    { id: "visual", label: "Visual", description: "I learn best by seeing (images, diagrams)." },
    { id: "auditory", label: "Auditory", description: "I learn best by listening." },
    { id: "reading", label: "Reading/Writing", description: "I learn best by reading and taking notes." },
    { id: "kinesthetic", label: "Kinesthetic", description: "I learn best by doing (hands-on)." },
];

const plans = [
    { id: "Free", name: "Free", price: "₦0", features: ["5 Quizzes/day", "Basic Analytics"] },
    { id: "Pro", name: "Pro", price: "₦1,000", features: ["Unlimited Quizzes", "Advanced Analytics", "Priority Support"] },
    { id: "Team", name: "Team", price: "₦2,000", features: ["Everything in Pro", "Team Collaboration", "Admin Dashboard"] },
];

const Onboarding = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("Free");
    const [loading, setLoading] = useState(false);

    const handleGoalToggle = (goal) => {
        setSelectedGoals((prev) =>
            prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
        );
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            await completeOnboarding();
        }
    };

    const completeOnboarding = async () => {
        setLoading(true);
        try {
            // 1. Update Profile
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    onboarding_completed: true,
                    learning_goals: selectedGoals,
                    learning_style: selectedStyle,
                    plan: selectedPlan
                })
                .eq("id", user.id);

            if (profileError) throw profileError;

            // 2. Create Welcome Notification
            const { error: notificationError } = await supabase
                .from("notifications")
                .insert({
                    user_id: user.id,
                    title: "Welcome to EduSparkz! 🎉",
                    message: "We're thrilled to have you here. Explore your dashboard, upload materials, and start generating quizzes to boost your learning journey. If you have any questions, check out the FAQ or contact support.",
                    is_read: false
                });

            if (notificationError) console.error("Failed to create welcome notification:", notificationError);

            // Update local user context
            setUser({
                ...user,
                onboarding_completed: true,
                learning_goals: selectedGoals,
                learning_style: selectedStyle,
                plan: selectedPlan
            });

            toast.success("Profile setup complete!");

            // Redirect based on plan (simulated)
            if (selectedPlan !== "Free") {
                navigate("/pricing"); // Or payment gateway
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            console.error("Onboarding error:", error);
            toast.error("Failed to save preferences. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-space-dark p-4 relative overflow-hidden">
            {/* 🌌 Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <Card className="w-full max-w-lg glass-card border-white/10 shadow-2xl relative z-10">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-white/5 p-3 rounded-full w-fit border border-white/10">
                        {steps[currentStep].icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        {steps[currentStep].title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {steps[currentStep].description}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 0 && (
                                <div className="text-center space-y-4">
                                    <p className="text-gray-300">
                                        Hi {user?.user_metadata?.full_name || "there"}! We're excited to have you on board.
                                        This quick setup will help us tailor the content just for you.
                                    </p>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-3">
                                    {learningGoals.map((goal) => (
                                        <div key={goal} className="flex items-center space-x-2 p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                                            <Checkbox
                                                id={goal}
                                                checked={selectedGoals.includes(goal)}
                                                onCheckedChange={() => handleGoalToggle(goal)}
                                                className="border-white/30 data-[state=checked]:bg-electric-cyan data-[state=checked]:text-space-dark"
                                            />
                                            <Label htmlFor={goal} className="flex-1 cursor-pointer text-gray-200 font-medium">
                                                {goal}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle} className="space-y-3">
                                    {learningStyles.map((style) => (
                                        <div key={style.id} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedStyle === style.id ? 'border-hot-magenta bg-hot-magenta/10' : 'border-white/10 hover:bg-white/5'}`}>
                                            <RadioGroupItem value={style.id} id={style.id} className="border-white/30 text-hot-magenta" />
                                            <Label htmlFor={style.id} className="flex-1 cursor-pointer">
                                                <div className="font-medium text-gray-200">{style.label}</div>
                                                <div className="text-sm text-gray-400">{style.description}</div>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-3">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-electric-cyan bg-electric-cyan/10' : 'border-white/10 hover:border-white/20'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-white">{plan.name}</h3>
                                                <span className="text-lg font-bold text-electric-cyan">{plan.price}</span>
                                            </div>
                                            <ul className="text-sm text-gray-400 space-y-1">
                                                {plan.features.slice(0, 2).map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-electric-cyan" /> {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            {selectedPlan === plan.id && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="w-4 h-4 bg-electric-cyan rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-space-dark" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>

                <CardFooter className="flex justify-between mt-6">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        Back
                    </Button>

                    <div className="flex gap-2">
                        {/* Skip button for Step 0 only */}
                        {currentStep === 0 && (
                            <Button variant="ghost" onClick={() => navigate("/user/dashboard")} className="text-gray-400 hover:text-white hover:bg-white/10">Skip</Button>
                        )}
                        <Button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && selectedGoals.length === 0) ||
                                (currentStep === 2 && !selectedStyle) ||
                                loading
                            }
                            className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold"
                        >
                            {loading ? "Saving..." : currentStep === steps.length - 1 ? "Finish" : "Next"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Onboarding;
