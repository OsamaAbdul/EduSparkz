import React from 'react';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black relative">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Main layout */}
      <div className="relative z-10 flex min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
