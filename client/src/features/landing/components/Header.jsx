import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, Twitter, Instagram, MessageCircle, Send } from "lucide-react";
import logoIcon from '../../../../public/edusparkz-logo.png';

const navLinks = [

  { label: "Features", href: "/#features" },
  { label: "Leaderboard", href: "/#leaderboard" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
];

const socialLinks = [
  { icon: Twitter, href: "https://x.com/OsamaAbduljnr", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com/osamaabduljnr", label: "Instagram" },
  { icon: MessageCircle, href: "mailto:ibrahimabdulosama@gmail.com", label: "Email" },
];

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl bg-space-dark/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl transition-all duration-300">
        <div className="px-6 py-2 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
            <div className="w-32 h-32">
              <img src={logoIcon} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Socials & CTA */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-3 pr-2 border-r border-white/10">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/5 text-xs font-bold"
                onClick={() => navigate("/api/auth/login")}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-electric-cyan text-space-dark font-bold hover:bg-electric-cyan/90 shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all text-xs rounded-full"
                onClick={() => navigate("/api/auth/register")}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden px-6 pb-6 pt-2 border-t border-white/10 animate-fade-in-up rounded-b-3xl bg-space-dark/95 backdrop-blur-xl absolute top-full left-0 right-0 mt-3 shadow-2xl border border-white/5">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-base font-medium py-3 border-b border-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}

              <div className="flex gap-6 py-6 justify-center">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-electric-cyan transition-colors"
                  >
                    <social.icon size={22} />
                  </a>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 text-white hover:bg-white/5"
                  onClick={() => {
                    navigate("/api/auth/login");
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="rounded-full bg-electric-cyan text-space-dark font-bold hover:bg-electric-cyan/90 shadow-lg"
                  onClick={() => {
                    navigate("/api/auth/register");
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
