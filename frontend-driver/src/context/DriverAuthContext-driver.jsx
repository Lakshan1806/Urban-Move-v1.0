import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverAuthContext = createContext();

const DriverAuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get("/auth/driver/me");

      console.log(" AuthContext: driver authenticated", response.data);

      if (response.data.success) {
        setDriver(response.data.driver);
        setIsAuthenticated(true);
        return true;
      } else {
        setDriver(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", {
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      setDriver(null);
      setIsAuthenticated(false);
      return false;
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setDriver(null);
      setIsAuthenticated(false);
      window.location.href = "http://localhost:5173/signin";
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const getProfile = useCallback(async () => {
    try {
      const response = await axios.get("/auth/driver/profile");
      if (response.data) {
        setDriver(response.data);
        setIsAuthenticated(true);
        return response.data;
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  }, []);

  const value = {
    driver,
    isAuthenticated,
    checkAuth,
    logout,
    getProfile,
  };

  return (
    <DriverAuthContext.Provider value={value}>
      {children}
    </DriverAuthContext.Provider>
  );
};
const useDriverAuth = () => {
  const context = useContext(DriverAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { DriverAuthContext, DriverAuthProvider, useDriverAuth };
