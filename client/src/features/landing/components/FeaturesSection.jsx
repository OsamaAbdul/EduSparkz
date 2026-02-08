import { motion } from "framer-motion";
import {
  MessageSquare,
  Brain,
  Trophy,
  Target,
  TrendingUp,
  Smartphone,
  ChevronRight
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Intelligent Content Extraction",
      description: "Upload any document or image and watch our AI distill complex concepts into structured study materials.",
    },
    {
      icon: Brain,
      title: "Dynamic AI Assessment",
      description: "Transform your notes into comprehensive, adaptive quizzes that challenge your retention and deepen understanding.",
    },
    {
      icon: Trophy,
      title: "Immersive Achievement Hub",
      description: "Stay driven with a sophisticated reward system that celebrates every milestone in your academic growth.",
    },
    {
      icon: Target,
      title: "Peer Competition Engine",
      description: "Engage with a global community of learners and measure your expertise against top performers in real-time.",
    },
    {
      icon: TrendingUp,
      title: "Precision Learning Analytics",
      description: "Monitor your cognitive development through detailed insights and performance mapping designed for excellence.",
    },
    {
      icon: Smartphone,
      title: "Unified Learning Ecosystem",
      description: "Seamlessly transition between devices while maintaining a synchronized study flow, optimized for modern lifestyles.",
    },
  ];

  return (
    <section id="features" className="relative z-10 px-6 py-24 bg-space-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header: Split Columns */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:max-w-xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Why <span className="text-white">Edu</span><span className="text-electric-cyan">Sparkz</span> Stands Out
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:max-w-md"
          >
            <p className="text-lg text-gray-500 leading-relaxed pt-2">
              Beyond traditional study methods, EduSparkz leverages advanced AI to transform your unique content into a dynamic, precision-engineered learning experience.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-[#11141D] border border-white/5 hover:border-[#7BF6FC] hover:bg-[#7BF6FC] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-electric-cyan/5 rounded-full blur-2xl group-hover:bg-space-dark/10 transition-all duration-500" />

              <div className="relative z-10">
                {/* Premium Icon Container */}
                <div className="relative w-14 h-14 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/20 to-hot-magenta/20 rounded-2xl blur-sm group-hover:opacity-0 transition-opacity" />
                  <div className="relative w-full h-full rounded-2xl bg-[#1A1F2E] border border-white/10 flex items-center justify-center group-hover:bg-space-dark/10 group-hover:border-space-dark/20 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <feature.icon className="w-6 h-6 text-electric-cyan group-hover:text-space-dark transition-colors duration-300" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-space-dark mb-4 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-500 group-hover:text-space-dark/80 leading-relaxed transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
