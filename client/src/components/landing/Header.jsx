import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="
      fixed top-0 left-0 right-0 z-50 
      border-b transition-colors duration-300
      bg-white border-[#ACBDAA]/40 
      dark:bg-[#1E2D4C] dark:border-[#ACBDAA]/30
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[#ACBDAA] dark:bg-[#ACBDAA]/20">
              <Brain className="w-5 h-5 text-[#1E2D4C] dark:text-[#ACBDAA]" />
            </div>
            <span className="text-xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">
              EduSparkz
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="
                bg-[#ACBDAA] text-[#1E2D4C] border-[#1E2D4C]
                hover:opacity-90
                dark:bg-transparent dark:text-[#ACBDAA] dark:border-[#ACBDAA]
              "
              onClick={() => navigate("/api/auth/login")}
            >
              Login
            </Button>

            <Button
              type="button"
              variant="outline"
              className="
                bg-[#1E2D4C] text-[#ACBDAA] border-[#1E2D4C]
                hover:opacity-90
                dark:bg-[#ACBDAA] dark:text-[#1E2D4C] dark:border-[#ACBDAA]
              "
              onClick={() => navigate("/api/auth/register")}
            >
              Register
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
