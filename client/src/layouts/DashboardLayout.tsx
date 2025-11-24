
import { useState } from "react";
import { AnimatedSidebar } from "./AnimatedSidebar";
import { DashboardContent } from "./DashboardContent";

export const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("analytics");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex w-full">
      <AnimatedSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        <DashboardContent 
          activeSection={activeSection}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </main>
    </div>
  );
};
