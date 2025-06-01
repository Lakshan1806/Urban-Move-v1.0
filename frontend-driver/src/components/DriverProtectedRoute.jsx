import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking driver authentication...");

        const res = await axios.get("auth/driver/me");
        console.log("Auth success:", res.data);
        setAuthorized(true);
      } catch (err) {
        console.error(" Auth failed:", err?.response?.data || err.message);
        window.location.href = "http://localhost:5173/signin";
      }
    };
    checkAuth();
  }, [navigate]);

  if (!authorized) return <div>Loading...</div>;

  return children;
};

export default DriverProtectedRoute;
