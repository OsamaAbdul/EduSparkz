import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/useContext";

export const AdminSidebar = ({ isOpen, iconOnly, toggleSidebar }) => {
    const { logOut } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogOut = () => {
        logOut();
        toast.success("You have been logged out!");
        navigate("/api/auth/login");
    };

    const navItems = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <ShieldAlert className="w-5 h-5" /> },
    ];

    return (
        <div
            className={`${isOpen ? "w-64" : "w-16"
                } h-full bg-space-dark/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col`}
        >
            {/* Brand */}
            <div className="p-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 p-[1px]">
                        <div className="w-full h-full rounded-xl bg-space-dark flex items-center justify-center">
                            <ShieldAlert className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    {!iconOnly && isOpen && (
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                            Admin Panel
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
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <div className={`${isActive ? "text-red-500" : "group-hover:text-red-500 transition-colors"}`}>
                                {item.icon}
                            </div>
                            {!iconOnly && isOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

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
