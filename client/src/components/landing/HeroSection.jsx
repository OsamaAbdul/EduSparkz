import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Users,
  Award,
  Sparkles,
  Play,
  ArrowRight,
} from "lucide-react";

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

  const handleStartLearning = () => {
    navigate('/api/auth/login');
  };

  return (
    <section className="relative z-10 px-6 py-20 text-center">
      <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
          EduSparkz
          {/* <br />
          <span className="text-4xl md:text-6xl">Sparkz</span> */}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform learning into an interactive and personalized experience with state-of-the-art AI. 
          Upload learning materials, auto-generate quizzes, and get instant intelligent feedback.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 px-8 py-6 text-lg"
            onClick={handleStartLearning}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Now for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 bg-gray-800 border-gray-700 text-white font-sans px-8 py-6 text-lg"
            onClick={() => setIsModalOpen(true)}
          >
            Watch Demo
          </Button>
        </div>

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

      {/* ✅ Proper YouTube Embed inside Dialog */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>EduSparkz Demo</DialogTitle>
              <DialogDescription>
                Watch a quick demo of our EduSparkz platform.
              </DialogDescription>
            </DialogHeader>
            <div className="relative pt-[56.25%]">
              <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden">
                <YouTube
                  videoId={videoId}
                  className="w-full h-full"
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 1,
                      mute: 1,
                    },
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
