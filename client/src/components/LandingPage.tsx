
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { HeroSection } from "./landing/HeroSection";
import { FeaturesSection } from "./landing/FeaturesSection";
import { DeveloperSection } from "./landing/DeveloperSection";
import { TechStackSection } from "./landing/TechStackSection";
import { TestimonialsSection } from "./landing/TestimonialsSection";
import { ContactSection } from "./landing/ContactSection";
import { FAQSection } from "./landing/FAQSection";
import { CTASection } from "./landing/CTASection";
import { FooterSection } from "./landing/FooterSection";

export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const backgroundClass = isDarkBackground 
    ? "min-h-screen bg-black text-white overflow-x-hidden"
    : "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden";

  return (
    <div className={backgroundClass}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Quiz Generator
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Background</span>
            <Switch
              checked={isDarkBackground}
              onCheckedChange={setIsDarkBackground}
            />
          </div>
          <Badge variant="outline" className="border-purple-500/50 text-purple-300">
            MIT License
          </Badge>
          <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
            GitHub
          </Button>
        </div>
      </nav>

      <HeroSection isVisible={isVisible} />
      <FeaturesSection />
      <DeveloperSection />
      <TechStackSection />
      <TestimonialsSection />
      <ContactSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};
