import  { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import imgcl from "../signup_photos/signupcustomer.svg";
import imgl from "../signup_photos/linervector.svg";
import { Link } from "react-router-dom";
import Line1 from "../signup_photos/liner1.svg";
import GoogleLoginButton from "../components/GoogleLogin";
import OtpVerification from "../components/OtpVerfication";
import { FaArrowRight } from "react-icons/fa";
import getToastSeverity from "../utils/getToastSeverity";
import { Toast } from "primereact/toast";

const Login = () => {
  const { login } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
  });

  const [step, setStep] = useState(1);
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
      toast.current?.show({
        severity: "error",
        summary: "Account Terminated",
        detail: "Your account has been terminated",
        life: 4000,
      });
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
    setLoading(true);

    try {
      const response = await login.verifyCredentials(
        formData.username,
        formData.password
      );
      toast.current?.show({
        severity: getToastSeverity(response?.status || 200),
        summary: "Credentials Verified",
        detail: "Credentials verified successfully",
        life: 3000,
      });
      setStep(2);
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
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateSriLankanPhone(formData.phone)) {
        toast.current?.show({
          severity: "warn",
          summary: "Invalid Phone Number",
          detail: "Invalid phone number format (0XXXXXXXXX or +94XXXXXXXXX)",
          life: 4000,
        });
        setLoading(false);
        return;
      }
      const response = await login.verifyPhone(formData.phone);
      toast.current?.show({
        severity: getToastSeverity(response?.status || 200),
        summary: "Verification Code Sent",
        detail: "Verification code has been sent to your phone",
        life: 3000,
      });
      setStep(3);
    } catch (err) {
      const status = err.response?.status;

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Phone verification failed";
      toast.current?.show({
        severity: getToastSeverity(status || 500),
        summary: status ? `Error ${status}` : "Verification Error",
        detail: errorMsg,
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    setLoading(true);

    try {
      const response = await login.verifyOtp(otp);
      if (response.success) {
        toast.current?.show({
          severity: "success",
          summary: "Login Successful",
          detail: "Welcome! Redirecting to dashboard...",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
        return { success: true };
      }
      toast.current?.show({
        severity: "error",
        summary: "Verification Failed",
        detail: "OTP verification failed",
        life: 4000,
      });
      return { success: false };
    } catch (err) {
      const status = err.response?.status;

      const errorMsg =
        err.response?.data?.message || err.message || "OTP verification failed";
      toast.current?.show({
        severity: getToastSeverity(status || 500),
        summary: status ? `Error ${status}` : "OTP Error",
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await login.resendOtp();
      toast.current?.show({
        severity: getToastSeverity(response?.status || 200),
        summary: "OTP Resent",
        detail: "Verification code has been resent to your phone",
        life: 3000,
      });
      return { success: true };
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
      throw err;
    }
  };

  return (
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      {step === 1 && (
        <img
          src={imgcl}
          alt="Signup Background"
          className="absolute z-0 mx-auto w-auto h-[700px] pr-1 "
        />
      )}

      <div className="flex flex-col px-0.5 z-10 ">
        {step === 1 && (
          <form
            onSubmit={handleCredentialsSubmit}
            className="w-[230px] pt-[75px]"
          >
            <h2 className="pt-[10px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
              Sign in as a Customer
            </h2>

            <label className="block text-[18px] sm:text-[20px] p-0.5 font-medium font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
              Username
            </label>
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

            <label className="block text-[18px] sm:text-[20px] font-medium font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
              Password
            </label>
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

            <div className="button-wrapper">
              <button
                type="submit"
                className="button-primary flex gap-2 justify-center items-center "
                disabled={loading}
              >
                {loading ? "PROCESSING..." : "SIGN IN"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>

            <img src={imgl} alt="Divider" className="w-full h-auto" />
            <GoogleLoginButton />
            <p className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[16px] text-center">
              <Link to="/Register">Don't have an account? Sign up</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-35">
              <h1
                className="text-grad-stroke font-[300] text-[36px]"
                data-text="Enter your Mobile Number"
              >
                Enter your Mobile Number
              </h1>
              <p className="font-[700] text-[20px]">
                We will send a verification code to this number
              </p>

              <img src={Line1} className="h-auto w-full" alt="Line" />

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

              <div className="button-wrapper">
                <button
                  type="submit"
                  className="button-primary flex gap-2 justify-center items-center"
                  disabled={loading}
                >
                  {loading ? "SENDING..." : "CONTINUE"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 3 && (
          <OtpVerification
            onVerifyOtp={handleOtpVerify}
            onResendOtp={handleResendOtp}
            loading={loading}
            title="Verify your Mobile Number"
            subtitle="We sent a verification code to your phone"
            otpLength={6}
          />
        )}
      </div>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default Login;
