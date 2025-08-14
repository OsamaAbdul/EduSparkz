
import { Menu, Bell, Search } from "lucide-react";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { TeamSection } from "./sections/TeamSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { SettingsSection } from "./sections/SettingsSection";

interface DashboardContentProps {
  activeSection: string;
  onToggleSidebar: () => void;
}

const sectionTitles = {
  analytics: "Analytics Dashboard",
  projects: "Projects Overview",
  team: "Team Management",
  performance: "Performance Metrics",
  settings: "Settings & Preferences"
};

export const DashboardContent = ({ activeSection, onToggleSidebar }: DashboardContentProps) => {
  const renderSection = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsSection />;
      case "projects":
        return <ProjectsSection />;
      case "team":
        return <TeamSection />;
      case "performance":
        return <PerformanceSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <AnalyticsSection />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/70 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {sectionTitles[activeSection as keyof typeof sectionTitles]}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/70 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* Profile */}
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {renderSection()}
      </main>
    </div>
  );
};
