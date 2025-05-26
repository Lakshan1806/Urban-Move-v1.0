  import React, {
    createContext,
    useState,
    useCallback,
    useContext,
    useEffect
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
      const response = await axios.get("/auth/is-dauth");

      console.log("Auth check response:", response.data);

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

      if (error.message === "Account terminated") {
        navigate("/login?error=account_terminated");
      }
      return false;
    }
  }, [navigate]);
  
  useEffect(() =>{
    checkAuth();
  },[checkAuth]);

   const value = {
    driver,
    isAuthenticated,
    checkAuth
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