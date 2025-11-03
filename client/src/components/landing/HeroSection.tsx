import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Sparkles, Play, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  isVisible: boolean;
}

export const HeroSection = ({ isVisible }: HeroSectionProps) => {
  const stats = [
    { number: "10K+", label: "Quizzes Generated", icon: BookOpen },
    { number: "5K+", label: "Active Users", icon: Users },
    { number: "98%", label: "Accuracy Rate", icon: Award },
    { number: "24/7", label: "AI Availability", icon: Sparkles },
  ];

  return (
    <section className="relative z-10 px-6 py-20 text-center bg-[#1E2D4C] text-[#CEC0BB]">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Badge */}
        <div className="mb-6">
          <Badge className="bg-[#ACBDAA] text-[#1E2D4C] border-none mb-4">
            🎓 AI-Powered Learning
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#CEC0BB] leading-tight">
          AI Quiz Generator
          <br />
          <span className="text-4xl md:text-6xl text-[#ACBDAA]">
            & Evaluator
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-[#858585] mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform learning into an interactive and personalized experience with
          state-of-the-art AI APIs. Upload PDFs, auto-generate quizzes, and get
          instant intelligent feedback.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#CEC0BB] hover:text-[#1E2D4C] border-none px-8 py-6 text-lg font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-[#ACBDAA] text-[#CEC0BB] hover:bg-[#ACBDAA] hover:text-[#1E2D4C] px-8 py-6 text-lg"
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ACBDAA] rounded-full mb-2">
                <stat.icon className="w-6 h-6 text-[#1E2D4C]" />
              </div>
              <div className="text-2xl font-bold text-[#CEC0BB]">
                {stat.number}
              </div>
              <div className="text-sm text-[#858585]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
