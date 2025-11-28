import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Zap, Shield, Rocket, Target } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "PDF Text Extraction",
      description: "Upload PDFs, .DOCX, or images to extract clean, structured content using advanced AI.",
      color: "text-electric-cyan",
      borderColor: "border-electric-cyan/30",
      bg: "bg-electric-cyan/10"
    },
    {
      icon: Brain,
      title: "AI-Generated Quizzes",
      description: "Automatically generate dynamic quizzes powered by Gemini or OpenAI models.",
      color: "text-hot-magenta",
      borderColor: "border-hot-magenta/30",
      bg: "bg-hot-magenta/10"
    },
    {
      icon: Zap,
      title: "Instant Evaluation",
      description: "Receive instant feedback, detailed scores, and answer explanations immediately.",
      color: "text-electric-lime",
      borderColor: "border-electric-lime/30",
      bg: "bg-electric-lime/10"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Protect your quizzes and progress with JWT-based authentication and encryption.",
      color: "text-white",
      borderColor: "border-white/30",
      bg: "bg-white/10"
    },
    {
      icon: Rocket,
      title: "Modern React UI",
      description: "Built with a sleek, responsive React interface that’s optimized for all devices.",
      color: "text-electric-cyan",
      borderColor: "border-electric-cyan/30",
      bg: "bg-electric-cyan/10"
    },
    {
      icon: Target,
      title: "Motivation Boost",
      description: "Stay inspired with motivational quotes that adapt to your quiz performance.",
      color: "text-hot-magenta",
      borderColor: "border-hot-magenta/30",
      bg: "bg-hot-magenta/10"
    },
  ];

  return (
    <section className="relative z-10 px-6 py-12 md:py-20 bg-space-dark text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan to-hot-magenta">Features</span>
          </motion.h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, take, and evaluate quizzes — powered by AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass-card border ${feature.borderColor} hover:shadow-[0_0_30px_rgba(0,245,255,0.15)] transition-all duration-300 group`}>
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${feature.bg} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-white text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
