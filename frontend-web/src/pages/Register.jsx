import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import imgc from "../signup_photos/signupcustomer.svg";
import { Link } from "react-router-dom";
import imgl from "../signup_photos/linervector.svg";
import Line1 from "../signup_photos/liner1.svg";
import OtpInput from "../components/otp-input";
import success from "../signup_photos/success.svg";
import useCountdown from "../components/hooks/useCountdown";
import GoogleLoginButton from "../components/GoogleLogin";
import { FaArrowRight } from "react-icons/fa";
import getToastSeverity from "../utils/getToastSeverity";
import { Toast } from "primereact/toast";

const Register = () => {
  const toast = useRef(null);
  const { register, registrationStep, setRegistrationStep } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    otp: "",
    email: "",
    emailOTP: "",
  });

  const [loading, setLoading] = useState(false);

  const {
    secondsLeft: phoneSecondsLeft,
    isActive: isPhoneActive,
    start: startPhoneTimer,
    reset: resetPhoneTimer,
  } = useCountdown(60);

  const {
    secondsLeft: emailSecondsLeft,
    isActive: isEmailActive,
    start: startEmailTimer,
    reset: resetEmailTimer,
  } = useCountdown(60);

  useEffect(() => {
    const handleBeforeUnload = () => {
      register.clearRegistrationSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [register]);

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const progress = await register.getProgress();
        if (progress.status === "new") {
          setRegistrationStep(1);
          setFormData({
            username: "",
            password: "",
            phoneNumber: "",
            otp: "",
            email: "",
            emailOTP: "",
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            username: progress.username || "",
            phoneNumber: progress.phone || "",
            email: progress.email || "",
          }));
        }
      } catch (error) {
        console.error("Failed to check registration progress:", error);
        setRegistrationStep(1);
      }
    };

    checkProgress();
  }, [register]);

  const handleResendPhoneOtp = async () => {
    if (isPhoneActive) return;

    try {
      await register.resendOtp("phone");
      toast.current.show({
        severity: "success",
        summary: "OTP Sent",
        detail: "OTP has been resent to your phone",
        life: 3000,
      });
      startPhoneTimer();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to resend OTP",
        life: 4000,
      });
    }
  };

  const handleResendEmailOtp = async () => {
    if (isEmailActive) return;

    try {
      await register.resendOtp("email");
      toast.current.show({
        severity: "success",
        summary: "OTP Sent",
        detail: "OTP has been resent to your email",
        life: 3000,
      });
      startEmailTimer();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to resend OTP",
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
      if (registrationStep === 1) {
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!strongPasswordRegex.test(formData.password)) {
          toast.current.show({
            severity: "warn",
            summary: "Invalid Password",
            detail:
              "Password must be at least 6 characters and include: uppercase, lowercase, number, and special character",
            life: 4000,
          });
          setLoading(false);
          return;
        }
        await register.start(formData.username, formData.password);
        toast.current.show({
          severity: "success",
          summary: "Registration Started",
          detail: "Username and password set successfully",
          life: 3000,
        });
      } else if (registrationStep === 2) {
        if (!validateSriLankanPhone(formData.phoneNumber)) {
          toast.current.show({
            severity: "warn",
            summary: "Invalid Phone Number",
            detail:
              "Please enter a valid Sri Lankan phone number (0XXXXXXXXX or +94XXXXXXXXX)",
            life: 4000,
          });
          setLoading(false);
          return;
        }
        await register.addPhone(formData.phoneNumber);
        toast.current.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "Verification code sent to your phone",
          life: 3000,
        });
        startPhoneTimer();
      } else if (registrationStep === 3) {
        await register.verifyPhone(formData.otp);
        toast.current.show({
          severity: "success",
          summary: "Phone Verified",
          detail: "Phone number verified successfully",
          life: 3000,
        });
        resetPhoneTimer();
      } else if (registrationStep === 4) {
        await register.addEmail(formData.email);
        toast.current.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "Verification code sent to your email",
          life: 3000,
        });
        startEmailTimer();
      } else if (registrationStep === 5) {
        await register.verifyEmail(formData.emailOTP);
        toast.current.show({
          severity: "success",
          summary: "Email Verified",
          detail: "Email address verified successfully",
          life: 3000,
        });
        resetEmailTimer();
      }
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Registration Error",
        detail: err.message || "Registration failed. Please try again.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full px-0 py-0  overflow-auto min-h-0">
      {registrationStep === 1 && (
        <img
          src={imgc}
          alt="Signup Background"
          className=" absolute z-0 w-full h-[700px] hidden lg:block pt-0"
        />
      )}

      <div className="flex flex-col px-0.5 z-10 lg:pt-[90px]">
        {registrationStep === 1 && (
          <form onSubmit={handleSubmit} className="lg:w-[240px] pl-2 ">
            <h2 className="text-center text-[18px] sm:text-[22px]  font-medium bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
              Signup as a Customer
            </h2>

            <label className="block text-[18px] sm:text-[20px] p-0.5 font-medium font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text my-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="bg-white w-full p-1 border rounded border-[#FFD12E]"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <label className="block text-[18px] sm:text-[20px] font-medium font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text my-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="bg-white w-full p-1 border rounded border-[#FFD12E]"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <div className="button-wrapper m-3">
              <button
                type="submit"
                className="button-primary flex gap-2 justify-center items-center "
                disabled={loading}
              >
                {loading ? "PROCESSING..." : "SIGN UP"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>

            <img src={imgl} alt="Divider" className="w-full h-auto" />
            <GoogleLoginButton intent="signup" />
            <p className="text-center text-[14px]  mt-4 font-medium bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
              <Link to="/signin">Already have an account? Sign in</Link>
            </p>
          </form>
        )}

        {registrationStep === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-30">
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
                name="phoneNumber"
                placeholder="e.g., 0771234567 or +94771234567"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-white lg:w-80 w-full  p-2 border rounded border-[#FFD12E]"
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

        {registrationStep === 3 && (
          <form onSubmit={handleSubmit} className="lg:pb-0 pb-25">
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-30">
              <h1
                className="text-grad-stroke font-[300] text-[36px]"
                data-text="Verify your Mobile Number"
              >
                Verify your Mobile Number
              </h1>
              <p className="font-[700] text-[20px]">
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
                  className="button-primary flex gap-2 justify-center items-center"
                  disabled={loading}
                >
                  {loading ? "VERIFYING..." : "CONTINUE"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
              <button
                onClick={handleResendPhoneOtp}
                disabled={isPhoneActive || loading}
                className={`${isPhoneActive || loading ? "text-gray-400" : "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"}`}
              >
                {isPhoneActive
                  ? `Resend in ${phoneSecondsLeft}s`
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {registrationStep === 4 && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-[25px] pt-30">
              <h1
                className="text-grad-stroke font-[300] text-[36px]"
                data-text="Enter your Email Address"
              >
                Enter your Email Address
              </h1>
              <p className="font-[700] text-[20px] ">
                We will send a verification code to this email
              </p>
              <img src={Line1} className="h-auto w-full" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
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

        {registrationStep === 5 && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-30">
              <h1
                className="text-grad-stroke font-[300] text-[36px]"
                data-text="Verify your email address"
              >
                Verify your email address
              </h1>
              <p className="font-[700] text-[20px]">
                We sent a verification code to your email
              </p>
              <img src={Line1} className="h-auto w-full" />

              <OtpInput
                length={6}
                onOtpSubmit={(emailOTP) =>
                  setFormData({ ...formData, emailOTP })
                }
                disabled={loading}
              />

              <div className="button-wrapper">
                <button
                  type="submit"
                  className="button-primary flex gap-2 justify-center items-center"
                  disabled={loading}
                >
                  {loading ? "VERIFYING..." : "CONTINUE"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
              <button
                onClick={handleResendEmailOtp}
                disabled={isEmailActive || loading}
                className={`${isEmailActive || loading ? "text-gray-400" : "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"}`}
              >
                {isEmailActive
                  ? `Resend in ${emailSecondsLeft}s`
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {registrationStep === 6 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-30">
            <h1
              className="text-grad-stroke font-[300] text-[36px]"
              data-text="Account created successfully"
            >
              Account created successfully
            </h1>
            <img src={Line1} className="h-auto w-full" />
            <div className="button-wrapper">
              <button type="button" className="button-primary">
                <img src={success} alt="success" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default Register;
