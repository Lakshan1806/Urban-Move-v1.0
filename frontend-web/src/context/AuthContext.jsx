import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const response = await axios.get("/auth/is-auth");

      console.log("Auth check response:", response.data);

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", {
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      setUser(null);
      setIsAuthenticated(false);

      if (error.message === "Account terminated") {
        navigate("/login?error=account_terminated");
      }
      return false;
    }
  }, [navigate]);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("source") === "google") {
        navigate("/");
      }
    };

    initializeAuth();
  }, [checkAuth, navigate]);

  const register = {
    start: async (username, password) => {
      try {
        const response = await axios.post("auth/register/start", {
          username,
          password,
        });
        setRegistrationStep(2);
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    addPhone: async (phoneNumber) => {
      try {
        const response = await axios.post("auth/register/phone", {
          phoneNumber,
        });
        setRegistrationStep(3);
        return response.data;
      } catch (error) {
        if (error.response?.data?.requiredStep) {
          setRegistrationStep(getStepNumber(error.response.data.requiredStep));
        }
        throw error.response?.data || error;
      }
    },

    verifyPhone: async (otp) => {
      try {
        const response = await axios.post("auth/register/verify-phone", {
          otp,
        });
        setRegistrationStep(4);
        return response.data;
      } catch (error) {
        if (error.response?.data?.requiredStep) {
          setRegistrationStep(getStepNumber(error.response.data.requiredStep));
        }
        throw error.response?.data || error;
      }
    },

    addEmail: async (email) => {
      try {
        const response = await axios.post("auth/register/email", { email });
        setRegistrationStep(5);
        return response.data;
      } catch (error) {
        if (error.response?.data?.requiredStep) {
          setRegistrationStep(getStepNumber(error.response.data.requiredStep));
        }
        throw error.response?.data || error;
      }
    },

    verifyEmail: async (otp) => {
      try {
        const response = await axios.post("auth/register/verify-email", {
          otp,
        });

        setRegistrationStep(6);

        await checkAuth();

        setTimeout(() => navigate("/"), 2000);

        return response.data;
      } catch (error) {
        if (error.response?.data?.requiredStep) {
          setRegistrationStep(getStepNumber(error.response.data.requiredStep));
        }
        throw error.response?.data || error;
      }
    },

    getProgress: async () => {
      try {
        const response = await axios.get("auth/register/progress");
        if (response.data.status !== "new") {
          setRegistrationStep(getStepNumber(response.data.nextStep));
        }
        return response.data;
      } catch (error) {
        console.error("Progress check failed:", error);
        throw error;
      }
    },

    resendOtp: async (type) => {
      try {
        const response = await axios.post("auth/register/resend-otp", { type });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
    clearRegistrationSession: async () => {
      try {
        await axios.post("/auth/register/clear-session");
        setRegistrationStep(1);
      } catch (error) {
        console.error("Failed to clear registration session:", error);
      }
    },
  };

  const getStepNumber = (stepName) => {
    const steps = {
      start: 1,
      phone: 2,
      "verify-phone": 3,
      email: 4,
      "verify-email": 5,
    };
    return steps[stepName] || 1;
  };

  const login = {
    verifyCredentials: async (username, password) => {
      try {
        const response = await axios.post("/auth/login/verify-credentials", {
          username,
          password,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    verifyPhone: async (phoneNumber) => {
      try {
        const response = await axios.post("/auth/login/verify-phone", {
          phoneNumber,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    verifyOtp: async (otp) => {
      try {
        const response = await axios.post("/auth/login/verify-otp", { otp });

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          if (response.data.token) {
            document.cookie = `token=${response.data.token}; path=/; ${
              process.env.NODE_ENV === "production"
                ? "secure; sameSite=strict"
                : ""
            }`;
          }
        }
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    getProgress: async () => {
      try {
        const response = await axios.get("/auth/login/progress");
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    resendOtp: async () => {
      try {
        const response = await axios.post("/auth/login/resend-otp");
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw new Error("Failed to send password reset link");
    }
  };

  const resetPassword = async (token, password) => {
    setError(null);
    try {
      const response = await axios.post(`/auth/reset-password/${token}`, {
        password,
      });
      setMessage({ message: response.data.message });
    } catch (error) {
      setError("Failed to reset password");
    }
  };
  const loginWithGoogle = useCallback((intent = "login") => {
    try {
      setError(null);
      window.open(
        `http://localhost:5000/auth/google?intent=${intent}`,
        "_self",
      );
    } catch (error) {
      setError("Failed to initiate Google login");
      console.error("Google login error:", error);
    }
  }, []);

  const getProfile = useCallback(async () => {
    try {
      const response = await axios.get("/auth/profile");
      if (response.data) {
        setUser(response.data);
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
    user,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    getProfile,
    checkAuth,
    registrationStep,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
