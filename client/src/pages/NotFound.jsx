import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, Search, ArrowLeft } from "lucide-react";
import logoIcon from "../../public/edusparkz-logo.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-space-dark relative overflow-hidden flex items-center justify-center p-6 select-none">

      {/* 🌌 Cosmic Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />

      {/* Floating Nebula Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-96 h-96 bg-electric-cyan/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Orbital Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20"
          animate={{
            x: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            y: [Math.random() * 1000 - 500, Math.random() * 1000 - 500],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center space-y-12">

          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={logoIcon}
                alt="EduSparkz Logo"
                className="h-32 w-auto object-contain drop-shadow-[0_0_30px_rgba(0,245,255,0.3)]"
              />
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 tracking-tighter">
              404
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Knowledge Gap <span className="text-electric-cyan">Detected</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
              Looks like this page slipped through the analytics. Even the smartest AI gets lost sometimes.
            </p>
          </motion.div>

          {/* Navigation Paths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-8"
          >
            <Link to="/">
              <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-electric-cyan hover:bg-electric-cyan/5 transition-all duration-300 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-electric-cyan/10 transition-colors">
                  <Home className="w-5 h-5 text-gray-400 group-hover:text-electric-cyan" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Back to Home</div>
                  <div className="text-xs text-gray-500">Go to landing page</div>
                </div>
              </div>
            </Link>

            <Link to="/user/dashboard">
              <div className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-hot-magenta hover:bg-hot-magenta/5 transition-all duration-300 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-hot-magenta/10 transition-colors">
                  <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-hot-magenta" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Dashboard</div>
                  <div className="text-xs text-gray-500">Resume learning</div>
                </div>
              </div>
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="sm:col-span-2 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium pt-4"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back to Previous Page
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;



