'use client';

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex items-center gap-2 px-3 py-2 text-sm transition-all 
        ${isDark ? "bg-[#1E2D4C] text-[#ACBDAA] border-[#ACBDAA]" 
                 : "bg-white text-[#1E2D4C] border-[#858585]"}
        hover:opacity-90`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" /> Light Mode
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" /> Dark Mode
        </>
      )}
    </Button>
  );
};
