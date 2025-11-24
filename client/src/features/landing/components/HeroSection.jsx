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
import { BookOpen, Users, Award, Sparkles, Play, ArrowRight, FileText, Image as ImageIcon, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

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

  // Animation variants for revolving icons
  const orbitVariants = {
    animate: (i) => ({
      rotate: [0, 360],
      transition: {
        duration: 20 + i * 5, // Different speeds for different orbits
        repeat: Infinity,
        ease: "linear",
      },
    }),
  };

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#1E2D4C] text-gray-900 dark:text-[#ACBDAA] transition-colors duration-300">

      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Main Background Image - Visible mainly in dark mode */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500"
        >
          <img
            src="/hero-bg.png"
            alt="EduSparkz AI Background"
            className="w-full h-full object-cover opacity-30"
          />
        </motion.div>

        {/* Gradient Overlay for Readability - Adapts to mode */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white dark:from-[#1E2D4C]/90 dark:via-[#1E2D4C]/70 dark:to-[#1E2D4C] transition-colors duration-300" />

        {/* Revolving Educational Tools */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Orbit 1 */}
          <motion.div
            className="absolute w-[300px] h-[300px] border border-gray-300 dark:border-[#ACBDAA]/10 rounded-full transition-colors duration-300"
            custom={0}
            variants={orbitVariants}
            animate="animate"
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#1E2D4C] p-2 rounded-full border border-gray-200 dark:border-[#ACBDAA]/30 shadow-sm dark:shadow-none transition-colors duration-300">
              <BookOpen className="w-6 h-6 text-[#1E2D4C] dark:text-[#ACBDAA]" />
            </div>
          </motion.div>

          {/* Orbit 2 */}
          <motion.div
            className="absolute w-[500px] h-[500px] border border-gray-300 dark:border-[#ACBDAA]/10 rounded-full transition-colors duration-300"
            custom={1}
            variants={orbitVariants}
            animate="animate"
          >
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white dark:bg-[#1E2D4C] p-2 rounded-full border border-gray-200 dark:border-[#ACBDAA]/30 shadow-sm dark:shadow-none transition-colors duration-300">
              <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white dark:bg-[#1E2D4C] p-2 rounded-full border border-gray-200 dark:border-[#ACBDAA]/30 shadow-sm dark:shadow-none transition-colors duration-300">
              <ImageIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            </div>
          </motion.div>

          {/* Orbit 3 */}
          <motion.div
            className="absolute w-[700px] h-[700px] border border-gray-200 dark:border-[#ACBDAA]/5 rounded-full transition-colors duration-300"
            custom={2}
            variants={orbitVariants}
            animate="animate"
          >
            <div className="absolute bottom-10 right-20 bg-white dark:bg-[#1E2D4C] p-2 rounded-full border border-gray-200 dark:border-[#ACBDAA]/30 shadow-sm dark:shadow-none transition-colors duration-300">
              <GraduationCap className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </motion.div>
        </div>
      </div>

      <div
        className={`relative z-10 max-w-4xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-[#1E2D4C] dark:text-[#ACBDAA] leading-tight drop-shadow-sm dark:drop-shadow-lg transition-colors duration-300"
        >
          EduSparkz
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-[#858585] mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
        >
          Are you a student of a College, University, or Polytechnic? Upload your
          study materials and get personalized quizzes generated instantly.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            className="bg-[#1E2D4C] text-white hover:bg-[#1E2D4C]/90 dark:bg-[#ACBDAA] dark:text-[#1E2D4C] dark:hover:bg-[#CECBBA] dark:hover:text-[#1E2D4C] border-none px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg dark:shadow-[0_0_20px_rgba(172,189,170,0.3)]"
            onClick={() => navigate("/api/auth/login")}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Now for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-[#1E2D4C] text-[#1E2D4C] hover:bg-[#1E2D4C]/10 dark:border-[#ACBDAA] dark:text-[#ACBDAA] dark:hover:bg-[#ACBDAA] dark:hover:text-[#1E2D4C] px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-white/50 dark:bg-[#1E2D4C]/30"
            onClick={() => setIsModalOpen(true)}
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {stats.map(({ number, label, icon: Icon }, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/60 dark:bg-[#1E2D4C]/40 backdrop-blur-sm border border-gray-200 dark:border-[#ACBDAA]/10 hover:border-[#1E2D4C]/20 dark:hover:border-[#ACBDAA]/30 transition-all duration-300 shadow-sm dark:shadow-none">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1E2D4C] dark:bg-[#ACBDAA] rounded-full mb-2 shadow-md">
                <Icon className="w-6 h-6 text-white dark:text-[#1E2D4C]" />
              </div>
              <div className="text-2xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">{number}</div>
              <div className="text-sm text-gray-600 dark:text-[#858585]">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* YouTube Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl bg-white dark:bg-[#1E2D4C] text-gray-900 dark:text-[#ACBDAA] border border-gray-200 dark:border-[#858585]">
          <DialogHeader>
            <DialogTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] text-xl font-semibold">
              EduSparkz Demo
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-[#858585]">
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
