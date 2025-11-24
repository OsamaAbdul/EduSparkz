import React from 'react';

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] relative transition-colors duration-300">
      {/* Background gradients/patterns could go here if shared, but pages currently handle their own specific layouts */}

      {/* Main layout */}
      <div className="relative z-10 flex min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
