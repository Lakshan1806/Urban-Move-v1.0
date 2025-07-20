import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverAuthContext = createContext();

const DriverAuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const navigate = useNavigate();
  /*   useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("source") === "google") {
        navigate("/");
      }
    };

    initializeAuth();
  }, [checkAuth, navigate]); */
  const register = {
    start: async (username, password) => {
      try {
        const response = await axios.post("auth/dregister/start", {
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
        const response = await axios.post("auth/dregister/phone", {
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
        const response = await axios.post("auth/dregister/verify-phone", {
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
        const response = await axios.post("auth/dregister/email", { email });
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
        const response = await axios.post("auth/dregister/verify-email", {
          otp,
        });

        setRegistrationStep(6);

        return response.data;
      } catch (error) {
        if (error.response?.data?.requiredStep) {
          setRegistrationStep(getStepNumber(error.response.data.requiredStep));
        }
        throw error.response?.data || error;
      }
    },
    uploadDocuments: async (documents) => {
      try {
        const formData = new FormData();

        documents.forEach((file) => {
          formData.append("documents", file);
        });

        const response = await axios.post(
          "auth/dregister/upload-documents",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setRegistrationStep(7);
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
        const response = await axios.get("auth/dregister/progress");
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
        const response = await axios.post("auth/dregister/resend-otp", {
          type,
        });
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
      "upload-documents": 6,
    };
    return steps[stepName] || 1;
  };

  const login = {
    verifyCredentials: async (username, password) => {
      try {
        const response = await axios.post("/auth/dlogin/verify-credentials", {
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
        const response = await axios.post("/auth/dlogin/verify-phone", {
          phoneNumber,
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    verifyOtp: async (otp) => {
      try {
        const response = await axios.post("/auth/dlogin/verify-otp", { otp });

        if (response.data.success) {
          setDriver(response.data.user);
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
        const response = await axios.get("/auth/dlogin/progress");
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },

    resendOtp: async () => {
      try {
        const response = await axios.post("/auth/dlogin/resend-otp");
        return response.data;
      } catch (error) {
        throw error.response?.data || error;
      }
    },
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setDriver(null);
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
      `http://localhost:5000/auth/google/driver?intent=${intent}`,
        "_self"
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
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    getProfile,
    registrationStep,
    setRegistrationStep,
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
