import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookX, ChartNoAxesCombined, LogOut, Brain, FileText, Zap, MessageSquare, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/useContext";

export const Sidebar = ({ isOpen, iconOnly, toggleSidebar }) => {
  const { user, logOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    logOut();
    toast.success("You have been logged out!");
    navigate("/api/auth/login");
  };

  const navItems = [
    { to: "/user/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { to: "/user/start-quiz", label: "Start Quiz", icon: <Brain className="w-5 h-5" /> },
    { to: "/user/materials", label: "My Materials", icon: <FileText className="w-5 h-5" /> },
    { to: "/user/history", label: "History", icon: <BookX className="w-5 h-5" /> },
    { to: "/user/leaderboard", label: "Leaderboard", icon: <ChartNoAxesCombined className="w-5 h-5" /> },
    { to: "/user/chat", label: "AI Tutor", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: "/admin/dashboard", label: "Admin Panel", icon: <ShieldAlert className="w-5 h-5" /> });
  }

  return (
    <div
      className={`${isOpen ? "w-64" : "w-16"
        } h-full bg-space-dark/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col`}
    >
      {/* Brand */}
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-electric-cyan to-hot-magenta p-[1px]">
            <div className="w-full h-full rounded-xl bg-space-dark flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </div>
          {!iconOnly && isOpen && (
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Edu</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-cyan to-hot-magenta">Sparkz</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center ${iconOnly || !isOpen ? "justify-center" : "space-x-3"
                } px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                  ? "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <div className={`${isActive ? "text-electric-cyan" : "group-hover:text-electric-cyan transition-colors"}`}>
                {item.icon}
              </div>
              {!iconOnly && isOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Plan */}
      {!iconOnly && isOpen && (
        <div className="px-4 mb-4">
          <Link
            to="/pricing"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-electric-cyan to-hot-magenta text-white font-bold shadow-lg hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300 group"
          >
            <Zap className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>Upgrade Plan</span>
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogOut}
          className={`flex items-center ${iconOnly || !isOpen ? "justify-center" : "space-x-3"
            } px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 w-full transition-all duration-300 group`}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!iconOnly && isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};
