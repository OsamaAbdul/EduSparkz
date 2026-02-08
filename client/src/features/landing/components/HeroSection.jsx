import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Play, ArrowRight, FileText, Image as ImageIcon, Youtube, Link as LinkIcon, UploadCloud } from "lucide-react";
import confetti from "canvas-confetti";

export const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse parallax effect for 3D elements
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-500, 500], [10, -10]);
  const rotateY = useTransform(x, [-500, 500], [-10, 10]);

  const springConfig = { damping: 25, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleStartLearning = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#FF2E63', '#39FF14']
    });
    setTimeout(() => navigate("/api/auth/login"), 800);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-space-dark flex items-center justify-center perspective-1000"
      onMouseMove={handleMouseMove}
    >
      {/* 🌌 Nebula Particle Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { opacity: 0 },
            fpsLimit: 60,
            particles: {
              color: { value: ["#00F5FF", "#FF2E63", "#ffffff"] },
              links: {
                color: "rgba(255, 255, 255, 0.1)",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                straight: false,
                outModes: { default: "bounce" },
              },
              number: { density: { enable: true, area: 800 }, value: 60 },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-dark/50 to-space-dark pointer-events-none" />
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 pt-20">

        {/* 📝 Left Content: Text & CTA */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left space-y-8"
        >


          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
            Upload <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta animate-pulse">Anything.</span> <br />
            Learn <span className="relative inline-block">
              <span className="absolute inset-0 bg-electric-cyan/20 blur-xl"></span>
              <span className="relative text-white glitch-text" data-text="Instantly">Instantly.</span>
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
            Transform PDFs, YouTube videos, and images into gamified quizzes in seconds.
            Join the <span className="text-electric-cyan font-bold">Knowledge Galaxy</span> today.
          </p>

          <div className="flex flex-col sm:flex-row gap-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartLearning}
              className="relative group px-8 py-4 bg-electric-cyan text-space-dark font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative flex items-center gap-2">
                Start Learning Now <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>


          </div>


        </motion.div>

        {/* 📱 Right Content: 3D Phone Mockup */}
        <motion.div
          style={{ rotateX: springRotateX, rotateY: springRotateY }}
          className="relative hidden lg:flex items-center justify-center perspective-1000"
        >
          {/* Floating Icons Orbiting */}
          {[FileText, Youtube, ImageIcon, LinkIcon].map((Icon, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              className={`absolute z-20 p-4 rounded-2xl glass-card border-white/20 shadow-2xl
                ${i === 0 ? '-top-10 -left-10' : ''}
                ${i === 1 ? 'top-20 -right-10' : ''}
                ${i === 2 ? '-bottom-10 left-10' : ''}
                ${i === 3 ? 'bottom-20 -right-5' : ''}
              `}
            >
              <Icon className={`w-8 h-8 ${i === 0 ? 'text-electric-cyan' :
                i === 1 ? 'text-red-500' :
                  i === 2 ? 'text-hot-magenta' : 'text-electric-lime'
                }`} />
            </motion.div>
          ))}

          {/* The Phone Card */}
          <div className="relative w-[320px] h-[640px] bg-space-dark rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden glass-card">
            {/* Screen Content */}
            <div className="absolute inset-0 bg-space-light flex flex-col">
              {/* Header */}
              <div className="h-14 bg-space-dark/50 backdrop-blur flex items-center justify-between px-6 border-b border-white/5">
                <div className="w-12 h-4 bg-gray-700 rounded-full" />
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-electric-cyan" />
                  <div className="w-2 h-2 rounded-full bg-hot-magenta" />
                </div>
              </div>

              {/* Chat/Quiz UI Simulation */}
              <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Simulated Messages */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 max-w-[80%]"
                >
                  <p className="text-xs text-gray-300">Generating quiz from "Intro to Physics.pdf"...</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 }}
                  className="bg-electric-cyan/10 p-4 rounded-2xl border border-electric-cyan/30"
                >
                  <h4 className="text-electric-cyan font-bold text-sm mb-2">Question 1</h4>
                  <p className="text-white text-sm mb-3">What is the formula for kinetic energy?</p>
                  <div className="space-y-2">
                    {['E = mc²', 'KE = ½mv²', 'F = ma'].map((opt, idx) => (
                      <div key={idx} className={`p-2 rounded-lg text-xs border ${idx === 1 ? 'bg-electric-cyan text-space-dark border-electric-cyan' : 'border-white/10 text-gray-400'}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Upload Animation */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-hot-magenta rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,46,99,0.5)]"
                >
                  <UploadCloud className="text-white w-8 h-8" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>


    </section>
  );
};
