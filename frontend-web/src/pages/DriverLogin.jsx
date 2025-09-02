import { useState, useContext, useEffect, useRef } from "react";
import { DriverAuthContext } from "../context/driverAuthContext";
import { useLocation } from "react-router-dom";
import imgd from "../signup_photos/signindriver.svg";
import imgl from "../signup_photos/linervector.svg";
import { Link } from "react-router-dom";
import OtpInput from "../components/otp-input";
import Line1 from "../signup_photos/liner1.svg";
import useCountdown from "../components/hooks/useCountdown";
import GoogleLoginButton from "../components/GoogleLoginDriver";
import { FaArrowRight } from "react-icons/fa";
import getToastSeverity from "../utils/getToastSeverity";
import { Toast } from "primereact/toast";

const DriverLogin = () => {
  const { login } = useContext(DriverAuthContext);
  const location = useLocation();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    otp: "",
  });

  const [step, setStep] = useState(1);
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
      toast.current?.show({
        severity: "error",
        summary: "Account Terminated",
        detail: "Your account has been terminated",
        life: 4000,
      });
    }
  }, [location]);

  const handleResendPhoneOtp = async () => {
    if (isPhoneActive) return;
    try {
      const response = await login.resendOtp();
      toast.current?.show({
        severity: getToastSeverity(response?.status || 200),
        summary: "OTP Resent",
        detail: "Verification code has been resent to your phone",
        life: 3000,
      });
      startPhoneTimer();
    } catch (err) {
      const status = err.response?.status;
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to resend OTP";

      toast.current?.show({
        severity: getToastSeverity(status || 500),
        summary: status ? `Error ${status}` : "Resend Error",
        detail: errorMsg,
        life: 4000,
      });
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
    setLoading(true);

    try {
      if (step === 1) {
        const response = await login.verifyCredentials(
          formData.username,
          formData.password,
        );
        toast.current?.show({
          severity: getToastSeverity(response?.status || 200),
          summary: "Credentials Verified",
          detail: "Username and password verified successfully",
          life: 3000,
        });
        setStep(2);
      } else if (step === 2) {
        if (!validateSriLankanPhone(formData.phone)) {
          toast.current?.show({
            severity: "warn",
            summary: "Invalid Phone Number",
            detail:
              "Please enter a valid Sri Lankan phone number (0XXXXXXXXX or +94XXXXXXXXX)",
            life: 4000,
          });
        }
        const response = await login.verifyPhone(formData.phone);
        toast.current?.show({
          severity: getToastSeverity(response?.status || 200),
          summary: "Verification Code Sent",
          detail: "OTP has been sent to your phone number",
          life: 3000,
        });
        startPhoneTimer();
        setStep(3);
      } else if (step === 3) {
        const response = await login.verifyOtp(formData.otp);
        if (response.success) {
          toast.current?.show({
            severity: "success",
            summary: "Login Successful",
            detail: "Welcome! You have been logged in successfully",
            life: 3000,
          });
          resetPhoneTimer();
        }
        setTimeout(() => {
          window.location.href = "http://localhost:5174/";
        }, 1000);
      }
    } catch (err) {
      const status = err.response?.status;

      const errorMsg =
        err.response?.data?.message || err.message || "Login failed";
      toast.current?.show({
        severity: getToastSeverity(status || 500),
        summary: status ? `Error ${status}` : "Login Error",
        detail: errorMsg,
        life: 4000,
      });
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
    <div className="flex h-full min-h-0 flex-col items-center overflow-auto px-0 py-0">
      {step === 1 && (
        <img
          src={imgd}
          alt="Signup Background"
          className="absolute z-0 mx-auto h-[700px] w-auto pl-3"
        />
      )}

      <div className="z-10 flex flex-col px-0.5">
        <form onSubmit={handleSubmit} className="w-[250px] pt-[70px]">
          {step === 1 && (
            <>
              <h2 className="bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text pt-[15px] text-center font-sans text-[20px] font-[400] text-transparent">
                Sign in as a driver
              </h2>

              <p className="mb-0 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text pt-[10px] text-start font-sans text-[18px] font-[400] text-transparent">
                Username
              </p>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full rounded border border-[#FFD12E] bg-white p-2"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <p className="mb-0 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text pt-[10px] text-start font-sans text-[18px] font-[400] text-transparent">
                Password
              </p>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full rounded border border-[#FFD12E] bg-white p-2"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3 flex items-center">
                <Link
                  to="/forgot-password"
                  className="flex items-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-sm text-transparent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="button-wrapper mb-3">
                <button
                  type="submit"
                  className="button-primary flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? "PROCESSING..." : "SIGN IN"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>

              <img src={imgl} alt="Divider" className="h-auto w-full" />
              <GoogleLoginButton />
              <p className="bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text pt-[15px] text-center font-sans text-[16px] font-[400] text-transparent">
                <Link to="/Register">Don't have an account? Sign up</Link>
              </p>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {step === 2 && (
            <>
              <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
                <h1
                  className="text-grad-stroke text-[36px] font-[300]"
                  data-text="Enter your Mobile Number"
                >
                  Enter your Mobile Number
                </h1>
                <p className="text-[20px] font-[700]">
                  We will send a verification code to this number
                </p>

                <img src={Line1} className="h-auto w-full" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g., 0771234567 or +94771234567"
                  className="w-80 rounded border border-[#FFD12E] bg-white p-2"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <div className="button-wrapper">
                  <button
                    type="submit"
                    className="button-primary flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? "SENDING..." : "CONTINUE"}
                    <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {step === 3 && (
            <>
              <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
                <h1
                  className="text-grad-stroke text-[36px] font-[300]"
                  data-text="Verify your Mobile Number"
                >
                  Verify your Mobile Number
                </h1>
                <p className="text-[20px] font-[700]">
                  We sent a verification code to your phone
                </p>
                <img src={Line1} className="h-auto w-full" />

                <OtpInput
                  length={6}
                  onOtpSubmit={(otp) => setFormData({ ...formData, otp })}
                  disabled={loading}
                />

                <div className="button-wrapper">
                  <button
                    type="submit"
                    className="button-primary flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? "VERIFYING..." : "CONTINUE"}
                    <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                  </button>
                </div>
                <button
                  onClick={handleResendPhoneOtp}
                  disabled={isPhoneActive || loading}
                  className={`${isPhoneActive || loading ? "text-gray-400" : "bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent"}`}
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
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default DriverLogin;
