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
    ? "min-h-screen bg-[#1E2D4C] text-[#CECOBB] overflow-x-hidden"
    : "min-h-screen bg-gradient-to-br from-[#ACBDAA] via-[#CEC0BB] to-[#ACBDAA] text-[#1E2D4C] overflow-x-hidden";

  return (
    <div className={backgroundClass}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ACBDAA]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#CEC0BB]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#858585]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#ACBDAA] to-[#CEC0BB] rounded-lg flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-[#1E2D4C]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-[#CEC0BB] to-[#ACBDAA] bg-clip-text text-transparent">
            AI Quiz Generator
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#858585]">Background</span>
            <Switch
              checked={isDarkBackground}
              onCheckedChange={setIsDarkBackground}
            />
          </div>
          <Badge
            variant="outline"
            className="border-[#ACBDAA]/50 text-[#ACBDAA]"
          >
            MIT License
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="border-[#CEC0BB]/30 text-[#CEC0BB] hover:bg-[#ACBDAA]/10 hover:text-[#1E2D4C]"
          >
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
