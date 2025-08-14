import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookX, ChartNoAxesCombined, Settings, LogOut, Brain } from 'lucide-react';
import { toast } from "sonner";
import { useUser } from '../../context/useContext';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogOut = () => {
    console.log("Logging out, navigating to /api/auth/login"); 
    logOut();
    toast.success("You have been logged out!");
    navigate("/api/auth/login");
  };

  // Define navigation items
  const navItems = [
    { to: "/user/dashboard", label: "Start Quiz", icon: <Home className="w-5 h-5" /> },
    { to: "/user/history", label: "History", icon: <BookX className="w-5 h-5" /> },
    { to: "/user/leaderboard", label: "Leaderboard", icon: <ChartNoAxesCombined className="w-5 h-5" /> },
    // { to: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> }, // Commented out as in original
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-black/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 overflow-y-auto h-full`}>
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="mb-6 pt-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              {isOpen && <span className="text-white font-semibold">EduSparkz</span>}
            </div>
          </div>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => console.log(`Navigating to ${item.to}`)} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogOut}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 w-full"
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};