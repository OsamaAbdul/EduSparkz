import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookX, ChartNoAxesCombined, LogOut, Brain } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../../context/useContext";

export const Sidebar = ({ isOpen, iconOnly, toggleSidebar }) => {
  const { logOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogOut = () => {
    logOut();
    toast.success("You have been logged out!");
    navigate("/api/auth/login");
  };

  const navItems = [
    { to: "/user/dashboard", label: "Start Quiz", icon: <Home className="w-5 h-5" /> },
    { to: "/user/history", label: "History", icon: <BookX className="w-5 h-5" /> },
    { to: "/user/leaderboard", label: "Leaderboard", icon: <ChartNoAxesCombined className="w-5 h-5" /> },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-[#1E2D4C]/80 backdrop-blur-xl border-r border-[#ACBDAA]/30 transition-all duration-300 overflow-y-auto h-full relative`}
    >
      {/* Brand */}
      <div className="p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-[#ACBDAA] rounded-full flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5 text-[#1E2D4C]" />
          </div>
          {!iconOnly && isOpen && (
            <span className="text-[#ACBDAA] font-semibold whitespace-nowrap">
              EduSparkz
            </span>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="mt-8 px-2">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center ${
                  iconOnly || !isOpen ? "justify-center" : "space-x-3"
                } px-3 py-2 rounded-full transition-all duration-200 transform ${
                  isActive
                    ? "bg-[#ACBDAA]/20 text-[#ACBDAA] shadow-md"
                    : "text-[#ACBDAA]/70 hover:text-[#ACBDAA] hover:bg-[#ACBDAA]/10 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {item.icon}
                {!iconOnly && isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <button
          onClick={handleLogOut}
          className={`flex items-center ${
            iconOnly || !isOpen ? "justify-center" : "space-x-3"
          } px-3 py-2 rounded-full text-[#ACBDAA]/70 hover:text-[#ACBDAA] hover:bg-[#ACBDAA]/10 w-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
        >
          <LogOut className="w-5 h-5" />
          {!iconOnly && isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
