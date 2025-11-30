import { Navigate } from "react-router-dom";
import { useUser } from "../context/useContext";
import { Loader2 } from "lucide-react";

const AdminRoute = ({ children }) => {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-space-dark flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-electric-cyan animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;
