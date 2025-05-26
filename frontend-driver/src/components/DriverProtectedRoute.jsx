import { useEffect } from "react";
import { useDriverAuth } from "../context/DriverAuthContext";
import { useNavigate } from "react-router-dom";

const DriverProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useDriverAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const valid = await checkAuth();
      if (!valid) {
      window.location.href = "http://localhost:5173/signin"; 
      }
    };
    verify();
  }, [checkAuth, navigate]);

  return isAuthenticated ? children : null;
};

export default DriverProtectedRoute;
