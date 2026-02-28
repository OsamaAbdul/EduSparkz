import { Link, useLocation } from "react-router-dom";
import { Home, BookX, ChartNoAxesCombined, Brain, FileText, MessageSquare, ShieldAlert } from "lucide-react";
import { useUser } from "@/context/useContext";

export const MobileNav = () => {
    const { user } = useUser();
    const location = useLocation();

    let navItems = [];

    if (user?.role === 'instructor') {
        navItems = [
            { to: "/instructor/dashboard", label: "Home", icon: <Home className="w-4 h-4" /> },
            { to: "/instructor/assign-quiz", label: "Assign", icon: <Brain className="w-5 h-5" />, isMain: true },
            { to: "/user/chat", label: "AI Tutor", icon: <MessageSquare className="w-4 h-4" /> },
        ];
    } else {
        navItems = [
            { to: "/user/dashboard", label: "Home", icon: <Home className="w-4 h-4" /> },
            { to: "/user/start-quiz", label: "Start Quiz", icon: <Brain className="w-5 h-5" />, isMain: true },
            { to: "/user/chat", label: "AI Tutor", icon: <MessageSquare className="w-4 h-4" /> },
        ];
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-space-dark/95 backdrop-blur-xl border-t border-white/10 pb-safe">
            <nav className="flex items-end justify-around px-6 py-1 relative h-14">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;

                    if (item.isMain) {
                        return (
                            <div key={item.to} className="relative -top-4">
                                <Link
                                    to={item.to}
                                    className={`flex items-center justify-center w-12 h-12 rounded-full shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all duration-300 ${isActive
                                        ? "bg-gradient-to-br from-electric-cyan to-hot-magenta text-white scale-105"
                                        : "bg-space-dark border-2 border-electric-cyan text-electric-cyan hover:scale-105"
                                        }`}
                                >
                                    {item.icon}
                                </Link>
                                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] font-medium text-gray-400 whitespace-nowrap">
                                    {item.label}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center gap-0.5 p-1 rounded-xl transition-all duration-300 min-w-[50px] ${isActive
                                ? "text-electric-cyan"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            <div className={`${isActive ? "text-electric-cyan" : ""}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[9px] font-medium ${isActive ? "text-electric-cyan" : "text-gray-400"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
