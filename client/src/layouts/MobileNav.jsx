import { Link, useLocation } from "react-router-dom";
import { Home, BookX, ChartNoAxesCombined, Brain, FileText, MessageSquare, ShieldAlert } from "lucide-react";
import { useUser } from "@/context/useContext";

export const MobileNav = () => {
    const { user } = useUser();
    const location = useLocation();

    const navItems = [
        { to: "/user/dashboard", label: "Home", icon: <Home className="w-5 h-5" /> },
        { to: "/user/start-quiz", label: "Quiz", icon: <Brain className="w-5 h-5" /> },
        { to: "/user/materials", label: "Files", icon: <FileText className="w-5 h-5" /> },
        { to: "/user/history", label: "History", icon: <BookX className="w-5 h-5" /> },
        { to: "/user/chat", label: "AI", icon: <MessageSquare className="w-5 h-5" /> },
        { to: "/user/leaderboard", label: "Rank", icon: <ChartNoAxesCombined className="w-5 h-5" /> },
    ];

    if (user?.role === 'admin') {
        navItems.push({ to: "/admin/dashboard", label: "Admin", icon: <ShieldAlert className="w-5 h-5" /> });
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-space-dark/90 backdrop-blur-xl border-t border-white/10 pb-safe">
            <nav className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[60px] ${isActive
                                ? "text-electric-cyan"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <div className={`${isActive ? "text-electric-cyan" : ""}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? "text-electric-cyan" : "text-gray-400"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
