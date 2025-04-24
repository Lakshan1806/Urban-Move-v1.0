import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Check if user is authenticated on mount

  const checkAuth = async () => {
    try {
      const response = await API.get("/auth/is-auth");

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuth();

    // Handle Google auth redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("google_auth")) {
      checkAuth();
    }
  }, []);

  // Register function
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    setMessage("");
    console.log("Sending registration data:", formData);
    try {
      const response = await API.post("/auth/register", formData);

      if (response.status === 201) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate("/");
      } else {
        setMessage(response.data.message);
      }
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // OTP login function
  const login = async ({ otp }) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/login", { otp });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
        details: error.response?.data?.details || null,
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Forgot password handler
  const forgotPassword = async (email) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error("Failed to send password reset link");
    }
  };

  // Resend OTP handler
  const resendOtp = async (email) => {
    try {
      const response = await API.post("/resend-otp", { email });
      return response.data;
    } catch (error) {
      console.error("Resend OTP error:", error);
      throw error.response?.data?.message || "Failed to resend OTP";
    }
  };

  const resetPassword = async (token, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage({ message: response.data.message, isLoading: false });
    } catch (error) {
      setError("Failed to reset password");
    }
  };
  const loginWithGoogle = () => {
    window.open("http://localhost:5000/auth/google?redirect=true", "_self"); 
  };
  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get("/auth/profile");
      if (response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return response.data;
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Failed to fetch profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resendOtp,
    resetPassword,
    loginWithGoogle,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
