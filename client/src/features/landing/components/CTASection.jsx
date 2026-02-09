import { Button } from "@/components/ui/button";
import { Star, Sparkles, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export const CTASection = () => {
  return (
    <section className="relative z-10 px-6 py-20 md:py-32 bg-space-dark overflow-hidden flex items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-electric-cyan/5 to-hot-magenta/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,245,255,0.1)] relative overflow-hidden group"
        >
          {/* Animated Glow Border */}
          <div className="absolute inset-0 border-2 border-transparent rounded-[3rem] bg-gradient-to-r from-electric-cyan to-hot-magenta opacity-0 group-hover:opacity-20 transition-opacity duration-500 mask-image-linear-gradient" />

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Ready to <span className="text-highlight">Launch</span> Your Learning?
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students, teachers, and lifelong learners who are already using AI to enhance their educational journey.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold px-10 py-8 text-xl rounded-full shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_50px_rgba(0,245,255,0.6)] hover:scale-105 transition-all duration-300 group"
            >
              <Rocket className="w-6 h-6 mr-2 group-hover:animate-bounce" />
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-10 py-8 text-xl rounded-full"
            >
              <Sparkles className="w-5 h-5 mr-2 text-hot-magenta" />
              View Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
