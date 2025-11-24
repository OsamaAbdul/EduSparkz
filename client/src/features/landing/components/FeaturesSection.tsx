
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Zap, Shield, Rocket, Target } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "PDF Text Extraction",
      description: "Upload PDFs and extract clean, structured content with advanced AI processing.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "AI-Generated Quizzes",
      description: "Generate dynamic MCQs using Gemini or OpenAI based on extracted text.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Instant Evaluation",
      description: "Get immediate feedback, scores, and detailed explanations for every answer.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Secure Auth System",
      description: "JWT-based login/registration to protect your content and quiz results.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Rocket,
      title: "Modern React UI",
      description: "Smooth, responsive frontend with routing, quiz-taking screens, and loading states.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Target,
      title: "Ready for Deployment",
      description: "Deploy frontend on Netlify, backend on Render/Heroku with robust Express.js and MongoDB.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, take, and evaluate quizzes with the power of artificial intelligence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
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
