import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DeveloperSection } from './components/DeveloperSection';
import { TechStackSection } from './components/TechStackSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection } from './components/FAQSection';
import { CTASection } from './components/CTASection';
import { FooterSection } from './components/FooterSection';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { ArrowUp } from 'lucide-react';
import { ProofSection } from './components/ProofSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { LeaderboardShowcaseSection } from './components/LeaderboardShowcaseSection';

export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-space-dark text-white overflow-x-hidden relative">
      {/* Header */}
      <Header />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-hot-magenta/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-electric-cyan/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-hot-magenta/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-electric-lime/10 rounded-full blur-xl animate-pulse delay-2000" />

      {/* Main Content */}
      <div className="relative z-10 pt-10">
        <HeroSection isVisible={isVisible} />
        <ProofSection />
        <FeaturesSection />
        <ShowcaseSection />
        <LeaderboardShowcaseSection />
        {/* <DeveloperSection /> */}
        {/* <TechStackSection /> */}
        <TestimonialsSection />
        {/* <ContactSection /> */}
        <FAQSection />
        {/* <CTASection /> */}
        <FooterSection />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-electric-cyan text-space-dark shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:bg-electric-cyan/90 transition-all duration-300 transform hover:scale-110 focus:outline-none"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};