import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/useContext";
import "@/components/Spinner.css"; // Import the CSS for the spinner

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.token) {
        navigate("/api/auth/login");
      } else if (user.onboarding_completed === false && window.location.pathname !== "/user/onboarding") {
        navigate("/user/onboarding");
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return user && user.token ? children : null;
};

export default ProtectedRoute;