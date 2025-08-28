import { useState, useEffect } from 'react';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { DeveloperSection } from './landing/DeveloperSection';
import { TechStackSection } from './landing/TechStackSection';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { ContactSection } from './landing/ContactSection';
import { FAQSection } from './landing/FAQSection';
import { CTASection } from './landing/CTASection';
import { FooterSection } from './landing/FooterSection';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import Header from './landing/Header';


export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);


const backgroundClass = isDarkBackground 
    ? "min-h-screen bg-black text-black overflow-x-hidden"
    : "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden";

  return (
    <div className={`min-h-screen ${backgroundClass} relative overflow-hidden`}>
      {/* Header */}
      <Header />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      {!isDarkMode && <div className={`absolute inset-0 ${overlayClass}`} />}
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Main Content */}
      <div className="relative z-10 pt-20">
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
    </div>
  );
};