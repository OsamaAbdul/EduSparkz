import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Zap, Shield, Rocket, Target } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "PDF Text Extraction",
      description:
        "Upload PDFs, .DOCX, or images to extract clean, structured content using advanced AI.",
      color: "#1E2D4C",
    },
    {
      icon: Brain,
      title: "AI-Generated Quizzes",
      description:
        "Automatically generate dynamic quizzes powered by Gemini or OpenAI models.",
      color: "#ACBDAA",
    },
    {
      icon: Zap,
      title: "Instant Evaluation",
      description:
        "Receive instant feedback, detailed scores, and answer explanations immediately.",
      color: "#CECOBB",
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description:
        "Protect your quizzes and progress with JWT-based authentication and encryption.",
      color: "#858585",
    },
    {
      icon: Rocket,
      title: "Modern React UI",
      description:
        "Built with a sleek, responsive React interface that’s optimized for all devices.",
      color: "#1E2D4C",
    },
    {
      icon: Target,
      title: "Motivation Boost",
      description:
        "Stay inspired with motivational quotes that adapt to your quiz performance.",
      color: "#ACBDAA",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-20 bg-white dark:bg-[#1E2D4C] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E2D4C] dark:text-[#ACBDAA]">
            Powerful Features
          </h2>
          <p className="text-lg text-[#858585] dark:text-[#CECOBB] max-w-2xl mx-auto">
            Everything you need to create, take, and evaluate quizzes — powered by AI.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-[#ACBDAA]/10 dark:bg-[#ACBDAA]/20 border border-[#E4E6E3] dark:border-[#858585]/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[#858585] dark:text-[#CECOBB] text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
