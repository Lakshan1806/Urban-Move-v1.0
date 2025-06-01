import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import imgcl from "../signup_photos/signupcustomer.svg";
import imgl from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import { Link } from "react-router-dom";
import Line1 from "../signup_photos/liner1.svg";
import GoogleLoginButton from "../components/GoogleLogin";
import OtpVerification from "../components/OtpVerfication";

const Login = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginProgress = async () => {
      try {
        const progress = await login.getProgress();
        if (progress.status === "in-progress") {
          const stepMap = {
            "verify-credentials": 1,
            "verify-phone": 2,
            "verify-otp": 3,
          };
          setStep(stepMap[progress.nextStep] || 1);
          setFormData((prev) => ({
            ...prev,
            username: progress.username || "",
            phone: progress.phoneNumber || "",
          }));
        }
      } catch (error) {
        console.error("Failed to check login progress:", error);
      }
    };
    checkLoginProgress();
  }, [login]);

  useEffect(() => {
    if (location.search.includes("account_terminated")) {
      setError("Your account has been terminated");
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateSriLankanPhone = (phone) => {
    const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
    return phoneRegex.test(phone);
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login.verifyCredentials(formData.username, formData.password);
      setStep(2);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!validateSriLankanPhone(formData.phone)) {
        throw new Error(
          "Invalid phone number format (0XXXXXXXXX or +94XXXXXXXXX)"
        );
      }
      await login.verifyPhone(formData.phone);
      setStep(3);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Phone verification failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    setError("");
    setLoading(true);

    try {
      const response = await login.verifyOtp(otp);
      if (response.success) {
        navigate("/");
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "OTP verification failed";
      setError(errorMsg);

      if (err.response?.data?.requiredStep) {
        const stepMap = {
          "verify-credentials": 1,
          "verify-phone": 2,
          "verify-otp": 3,
        };
        setStep(stepMap[err.response.data.requiredStep] || 1);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await login.resendOtp();
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
      throw err;
    }
  };

  return (
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      {step === 1 && (
        <img
          src={imgcl}
          alt="Signup Background"
          className="absolute z-0 w-full h-auto"
        />
      )}

      <div className="flex flex-col px-0.5 z-10 pt-[130px]">
        {step === 1 && (
          <form onSubmit={handleCredentialsSubmit} className="w-[340px]">
            <h2 className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
              Sign in as a Customer
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}

            <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
              Username
            </p>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="bg-white w-full p-2 border rounded border-[#FFD12E]"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
              Password
            </p>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="bg-white w-full p-2 border rounded border-[#FFD12E]"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-center mb-6">
              <Link
                to="/forgot-password"
                className="text-sm hover:underline flex items-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="pt-[10px] pb-[10px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] cursor-pointer"
                disabled={loading}
              >
                {loading ? "Processing..." : "SIGN IN"}
              </button>
            </div>

            <img src={imgl} alt="Divider" className="w-full h-auto" />
            <GoogleLoginButton />
            <p className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
              <Link to="/Register">Don't have an account? Sign up</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
              <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                Enter your Mobile Number
              </h1>
              <p className="font-[700] text-[20px]">
                We will send a verification code to this number
              </p>

              <img src={Line1} className="h-auto w-full" alt="Line" />
              {error && <p className="text-red-500 text-center">{error}</p>}

              <input
                type="tel"
                name="phone"
                placeholder="e.g., 0771234567 or +94771234567"
                className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                <button
                  type="submit"
                  className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Continue"}
                </button>
                <img src={arrow} className="pl-1 pt-1" alt="Arrow" />
              </div>
            </div>
          </form>
        )}

        {step === 3 && (
          <OtpVerification
            onVerifyOtp={handleOtpVerify}
            onResendOtp={handleResendOtp}
            error={error}
            loading={loading}
            title="Verify your Mobile Number"
            subtitle="We sent a verification code to your phone"
            otpLength={6}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
