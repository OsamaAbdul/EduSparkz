
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
    { number: "24/7", label: "AI Availability", icon: Sparkles }
  ];

  return (
    <section className="relative z-10 px-6 py-20 text-center">
      <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="mb-6">
          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0 mb-4">
            🎓 AI-Powered Learning
          </Badge>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
          AI Quiz Generator
          <br />
          <span className="text-4xl md:text-6xl">& Evaluator</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform learning into an interactive and personalized experience with state-of-the-art AI APIs. 
          Upload PDFs, auto-generate quizzes, and get instant intelligent feedback.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 px-8 py-6 text-lg">
            <Play className="w-5 h-5 mr-2" />
            Start Learning Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 px-8 py-6 text-lg">
            Watch Demo
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full mb-2">
                <stat.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
