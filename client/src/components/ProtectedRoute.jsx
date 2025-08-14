import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useContext";
import "./Spinner.css"; // Import the CSS for the spinner

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !user.token)) {
      navigate("/login");
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