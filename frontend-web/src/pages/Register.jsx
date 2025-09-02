import { useState, useContext, useEffect, useRef } from "react";
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
    <div className="flex h-full min-h-0 w-full flex-col items-center overflow-auto px-0 py-0">
      {registrationStep === 1 && (
        <img
          src={imgc}
          alt="Signup Background"
          className="absolute z-0 hidden h-[700px] w-full pt-0 lg:block"
        />
      )}

      <div className="z-10 flex flex-col px-0.5 lg:pt-[90px]">
        {registrationStep === 1 && (
          <form onSubmit={handleSubmit} className="pl-2 lg:w-[240px]">
            <h2 className="bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-center text-[18px] font-medium text-transparent sm:text-[22px]">
              Signup as a Customer
            </h2>

            <label className="my-1 block bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text p-0.5 font-sans text-[18px] font-medium text-transparent sm:text-[20px]">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full rounded border border-[#FFD12E] bg-white p-1"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <label className="my-1 block bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-[18px] font-medium text-transparent sm:text-[20px]">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full rounded border border-[#FFD12E] bg-white p-1"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <div className="button-wrapper m-3">
              <button
                type="submit"
                className="button-primary flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? "PROCESSING..." : "SIGN UP"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>

            <img src={imgl} alt="Divider" className="h-auto w-full" />
            <GoogleLoginButton intent="signup" />
            <p className="mt-4 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-center text-[14px] font-medium text-transparent">
              <Link to="/signin">Already have an account? Sign in</Link>
            </p>
          </form>
        )}

        {registrationStep === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-30">
              <h1
                className="text-grad-stroke text-[36px] font-[300]"
                data-text="Enter your Mobile Number"
              >
                Enter your Mobile Number
              </h1>
              <p className="text-[20px] font-[700]">
                We will send a verification code to this number
              </p>

              <img src={Line1} className="h-auto w-full" alt="Line" />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="e.g., 0771234567 or +94771234567"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full rounded border border-[#FFD12E] bg-white p-2 lg:w-80"
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
          </form>
        )}

        {registrationStep === 3 && (
          <form onSubmit={handleSubmit} className="pb-25 lg:pb-0">
            <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-30">
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
                className={`${isPhoneActive || loading ? "text-gray-400" : "cursor-pointer bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-transparent"}`}
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
                className="text-grad-stroke text-[36px] font-[300]"
                data-text="Enter your Email Address"
              >
                Enter your Email Address
              </h1>
              <p className="text-[20px] font-[700]">
                We will send a verification code to this email
              </p>
              <img src={Line1} className="h-auto w-full" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-80 rounded border border-[#FFD12E] bg-white p-2"
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
          </form>
        )}

        {registrationStep === 5 && (
          <form onSubmit={handleSubmit}>
            <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-30">
              <h1
                className="text-grad-stroke text-[36px] font-[300]"
                data-text="Verify your email address"
              >
                Verify your email address
              </h1>
              <p className="text-[20px] font-[700]">
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
                  className="button-primary flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? "VERIFYING..." : "CONTINUE"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
              <button
                onClick={handleResendEmailOtp}
                disabled={isEmailActive || loading}
                className={`${isEmailActive || loading ? "text-gray-400" : "cursor-pointer bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-transparent"}`}
              >
                {isEmailActive
                  ? `Resend in ${emailSecondsLeft}s`
                  : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {registrationStep === 6 && (
          <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-30">
            <h1
              className="text-grad-stroke text-[36px] font-[300]"
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
