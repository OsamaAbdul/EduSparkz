import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#1E2D4C] relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000" />

      <div className="relative z-10 px-4 sm:px-6" style={{ width: '600px', maxWidth: '600px' }}>
        <Card className="bg-black/50 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-white">
              <div className="mb-6 pt-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-[#ACBDAA] animate-bounce-slow">
                    EduSparkz
                  </span>
                </div>
              </div>
              404 - Page Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl text-white mb-6">
              Oops! The page you're looking for cannot be found.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#ACBDAA] text-[#1E2D4C] font-semibold py-2 px-4 hover:bg-[#ACBDAA]/80"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom bounce animation */}
      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s infinite;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;



