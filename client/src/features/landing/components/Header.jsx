
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
// import { ThemeToggle } from "@/components/ThemeToggle"; // Theme toggle might be redundant if we enforce Space Dark

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="
      fixed top-0 left-0 right-0 z-50 
      border-b border-white/10 transition-colors duration-300
      bg-space-dark/80 backdrop-blur-md
    "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-cyan to-hot-magenta p-[1px]">
              <div className="w-full h-full bg-space-dark rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-electric-cyan" />
              </div>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Edu<span className="text-electric-cyan">Sparkz</span>
            </span>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => navigate("/api/auth/login")}
            >
              Login
            </Button>

            <Button
              type="button"
              className="
                bg-electric-cyan text-space-dark font-bold
                hover:bg-electric-cyan/90 shadow-[0_0_15px_rgba(0,245,255,0.3)]
                transition-all
              "
              onClick={() => navigate("/api/auth/register")}
            >
              Get Started
            </Button>

            {/* <ThemeToggle /> */}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className="
          md:hidden flex flex-col items-center gap-4 py-6
          bg-space-dark border-t border-white/10
          animate-slideDown
        "
        >
          <Button
            type="button"
            variant="ghost"
            className="w-4/5 text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => {
              navigate("/api/auth/login");
              setMenuOpen(false);
            }}
          >
            Login
          </Button>

          <Button
            type="button"
            className="
              w-4/5
              bg-electric-cyan text-space-dark font-bold
              hover:bg-electric-cyan/90 shadow-[0_0_15px_rgba(0,245,255,0.3)]
            "
            onClick={() => {
              navigate("/api/auth/register");
              setMenuOpen(false);
            }}
          >
            Get Started
          </Button>

          {/* <ThemeToggle /> */}
        </div>
      )}
    </header>
  );
};

export default Header;
