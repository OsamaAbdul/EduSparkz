import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookOpen, Users, Award, Sparkles, Play, ArrowRight } from "lucide-react";

export const HeroSection = ({ isVisible }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoId = "JdIWlZjw2qs";

  const stats = [
    { number: "2K+", label: "Quizzes Generated", icon: BookOpen },
    { number: "1.2K+", label: "Active Users", icon: Users },
    { number: "99%", label: "Accuracy Rate", icon: Award },
    { number: "24/7", label: "AI Availability", icon: Sparkles },
  ];

  return (
    <section className="relative z-10 px-6 py-20 text-center bg-[#1E2D4C] text-[#ACBDAA] transition-all duration-500">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#ACBDAA] leading-tight">
          EduSparkz
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-[#858585] mb-8 max-w-3xl mx-auto leading-relaxed">
          Are you a student of a College, University, or Polytechnic? Upload your
          study materials and get personalized quizzes generated instantly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#CECBBA] hover:text-[#1E2D4C] border-none px-8 py-6 text-lg font-semibold transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/api/auth/login")}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Now for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-[#ACBDAA] text-[#ACBDAA] hover:bg-[#ACBDAA] hover:text-[#1E2D4C] px-8 py-6 text-lg font-medium transition-transform duration-300 hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map(({ number, label, icon: Icon }, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#ACBDAA] rounded-full mb-2">
                <Icon className="w-6 h-6 text-[#1E2D4C]" />
              </div>
              <div className="text-2xl font-bold text-[#ACBDAA]">{number}</div>
              <div className="text-sm text-[#858585]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl bg-[#1E2D4C] text-[#ACBDAA] border border-[#858585]">
          <DialogHeader>
            <DialogTitle className="text-[#ACBDAA] text-xl font-semibold">
              EduSparkz Demo
            </DialogTitle>
            <DialogDescription className="text-[#858585]">
              Watch a quick demo of how EduSparkz transforms learning.
            </DialogDescription>
          </DialogHeader>
          <div className="relative pt-[56.25%]">
            <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden">
              <YouTube
                videoId={videoId}
                className="w-full h-full"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1, mute: 1 },
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
