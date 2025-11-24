
import { useState } from "react";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Zap,
  Star
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "analytics", label: "Analytics", icon: BarChart3, color: "from-blue-500 to-cyan-500" },
  { id: "projects", label: "Projects", icon: FolderOpen, color: "from-emerald-500 to-teal-500" },
  { id: "team", label: "Team", icon: Users, color: "from-purple-500 to-pink-500" },
  { id: "performance", label: "Performance", icon: Zap, color: "from-orange-500 to-red-500" },
  { id: "settings", label: "Settings", icon: Settings, color: "from-gray-500 to-slate-500" },
];

export const AnimatedSidebar = ({ collapsed, onToggle, activeSection, onSectionChange }: SidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-white/70 hover:text-white"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full p-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group relative overflow-hidden ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {/* Background gradient effect */}
              {(isActive || isHovered) && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-xl transition-opacity duration-300`} />
              )}
              
              {/* Icon with gradient background */}
              <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                isActive ? `bg-gradient-to-r ${item.color}` : 'bg-white/10'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Label */}
              {!collapsed && (
                <span className="relative z-10 font-medium transition-all duration-300">
                  {item.label}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
          {!collapsed && (
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/90 font-medium">John Doe</p>
              <p className="text-white/60 text-sm">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
