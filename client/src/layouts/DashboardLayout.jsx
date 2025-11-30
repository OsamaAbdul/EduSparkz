import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import Header from './Header';
import { useMediaQuery } from 'react-responsive';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = ({ children }) => {
  const isLaptop = useMediaQuery({ minWidth: 1024 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(isLaptop);
  }, [isLaptop]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Easter Egg Listener
  useEffect(() => {
    let buffer = "";
    const handleKey = (e) => {
      buffer += e.key;
      if (buffer.length > 6) buffer = buffer.slice(-6);
      if (buffer === "sparkz") {
        import("canvas-confetti").then((confetti) => {
          const duration = 3000;
          const end = Date.now() + duration;
          (function frame() {
            confetti.default({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#00F5FF', '#FF2E63']
            });
            confetti.default({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#00F5FF', '#FF2E63']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
          })();
        });
        buffer = "";
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-space-dark text-white relative">
      {/* 🌌 Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Sidebar - Desktop Only */}
      <AnimatePresence mode="wait">
        {sidebarOpen && isLaptop && (
          <motion.aside
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`hidden lg:flex flex-col h-full z-[60] w-64 flex-shrink-0 bg-space-dark/80 backdrop-blur-xl border-r border-white/10`}
          >
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
        <Header toggleSidebar={toggleSidebar} showMenuButton={isLaptop} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-electric-cyan/20 scrollbar-track-transparent lg:pb-8 pb-24">
          {children}
        </main>
      </div>

      {/* Mobile Navigation - Mobile Only */}
      {!isLaptop && <MobileNav />}
    </div>
  );
};

export default DashboardLayout;
