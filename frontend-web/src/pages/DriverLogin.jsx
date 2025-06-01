import React, { useState, useContext, useEffect } from "react";
import { DriverAuthContext } from "../context/driverAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import imgd from "../signup_photos/signindriver.svg";
import imgl from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import { Link } from "react-router-dom";
import OtpInput from "../components/otp-input";
import Line1 from "../signup_photos/liner1.svg";
import useCountdown from "../components/hooks/useCountdown";
import GoogleLoginButton from "../components/GoogleLogin";

const DriverLogin = () => {
  const { login } = useContext(DriverAuthContext);
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    otp: "",
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    secondsLeft: phoneSecondsLeft,
    isActive: isPhoneActive,
    start: startPhoneTimer,
    reset: resetPhoneTimer,
  } = useCountdown(60);

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

  const handleResendPhoneOtp = async () => {
    if (isPhoneActive) return;
    try {
      await login.resendOtp();
      console.log("New OTP sent to your phone");
      startPhoneTimer();
    } catch (err) {
      console.error(err.message || "Failed to resend OTP");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateSriLankanPhone = (phone) => {
    const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (step === 1) {
        await login.verifyCredentials(formData.username, formData.password);
        setStep(2);
      } else if (step === 2) {
        if (!validateSriLankanPhone(formData.phone)) {
          throw new Error(
            "Invalid  phone number format (0XXXXXXXXX or +94XXXXXXXXX)"
          );
        }
        await login.verifyPhone(formData.phone);
        startPhoneTimer();
        setStep(3);
      } else if (step === 3) {
        const response = await login.verifyOtp(formData.otp);
        if (response.success) {
          resetPhoneTimer();
        }
        window.location.href = "http://localhost:5174/";
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMsg);

      if (err.response?.data?.requiredStep) {
        const stepMap = {
          "verify-credentials": 1,
          "verify-phone": 2,
          "verify-otp": 3,
        };
        setStep(stepMap[err.response.data.requiredStep] || 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      {step === 1 && (
        <img
          src={imgd}
          alt="Signup Background"
          className="absolute z-0 w-full mx-auto h-dvh pl-3"
        />
      )}

      <div className="flex flex-col px-0.5 z-10 pt-[130px]">
        <form onSubmit={handleSubmit} className="w-[300px]">
          {step === 1 && (
            <>
              <h2 className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
                Sign in as a driver
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
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}

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
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {step === 2 && (
            <>
              <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  Enter your Mobile Number
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this number
                </p>

                <img src={Line1} className="h-auto w-full" />
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
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
              </div>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {step === 3 && (
            <>
              <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  Verify your Mobile Number
                </h1>
                <p className="font-[700] text-[20px]">
                  We sent a verification code to your phone
                </p>
                <img src={Line1} className="h-auto w-full" />
                {error && <p className="text-red-500 text-center">{error}</p>}

                <OtpInput
                  length={6}
                  onOtpSubmit={(otp) => setFormData({ ...formData, otp })}
                  disabled={loading}
                />

                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Continue"}
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
                <button
                  onClick={handleResendPhoneOtp}
                  disabled={isPhoneActive || loading}
                  className={`${isPhoneActive || loading ? "text-gray-400" : "bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent  bg-clip-text"}`}
                >
                  {isPhoneActive
                    ? `Resend in ${phoneSecondsLeft}s`
                    : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;
