import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import imgc from "../signup_photos/signupcustomer.svg";
import { Link } from "react-router-dom";
import imgl from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import Line1 from "../signup_photos/liner1.svg";
import OtpInput from "../components/otp-input";
import success from "../signup_photos/success.svg";
import useCountdown from "../components/hooks/useCountdown";
import GoogleLoginButton from "../components/GoogleLogin";

const Register = () => {
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

  const [error, setError] = useState("");
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
      console.log("OTP resent to your phone");
      startPhoneTimer();
    } catch (error) {
      console.error(error.message || "Failed to resend OTP");
    }
  };

  const handleResendEmailOtp = async () => {
    if (isEmailActive) return;

    try {
      await register.resendOtp("email");
      console.log("OTP resent to your email");
      startEmailTimer();
    } catch (error) {
      console.error(error.message || "Failed to resend OTP");
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
      if (registrationStep === 1) {
        await register.start(formData.username, formData.password);
      } else if (registrationStep === 2) {
        if (!validateSriLankanPhone(formData.phoneNumber)) {
          setError(
            "Please enter a valid Sri Lankan phone number (0XXXXXXXXX or +94XXXXXXXXX)"
          );
          setLoading(false);
          return;
        }
        await register.addPhone(formData.phoneNumber);
        startPhoneTimer();
      } else if (registrationStep === 3) {
        await register.verifyPhone(formData.otp);
        resetPhoneTimer();
      } else if (registrationStep === 4) {
        await register.addEmail(formData.email);
        startEmailTimer();
      } else if (registrationStep === 5) {
        await register.verifyEmail(formData.emailOTP);
        resetEmailTimer();
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
          <form onSubmit={handleSubmit} className="lg:w-[240px] ">
            <h2 className="text-center text-[18px] sm:text-[22px]  font-medium bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
              Signup as a Customer
            </h2>
            {error && (
              <div>
                <p className="text-red-600 text-center text-sm font-medium">
                  {error}
                </p>
              </div>
            )}
            <label className="block text-[18px] sm:text-[20px] p-0.5 font-medium font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
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

            <label className="block text-[18px] sm:text-[20px] font-medium font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text">
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
            <div>
              <button
                type="submit"
                className="w-full py-2 text-center rounded-lg font-semibold font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text  text-[20px] cursor-pointer"
                disabled={loading}
              >
                {loading ? "Processing..." : "SIGN UP"}
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
                name="phoneNumber"
                placeholder="e.g., 0771234567 or +94771234567"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-white lg:w-80 w-full  p-2 border rounded border-[#FFD12E]"
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
          </form>
        )}

        {registrationStep === 3 && (
          <form onSubmit={handleSubmit} className="lg:pb-0 pb-25">
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto ">
              <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] lg:text-[48px] text-[30px]">
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
            <div className="flex flex-col items-center justify-center gap-[25px] ">
              <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] lg:text-[48px] text-[32px]">
                Enter your Email Address
              </h1>
              <p className="font-[700] text-[20px] ">
                We will send a verification code to this email
              </p>
              <img src={Line1} className="h-auto w-full" />
              {error && <p className="text-red-500 text-center">{error}</p>}

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
          </form>
        )}

        {registrationStep === 5 && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
              <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                Verify your email address
              </h1>
              <p className="font-[700] text-[20px]">
                We sent a verification code to your email
              </p>
              <img src={Line1} className="h-auto w-full" />
              {error && <p className="text-red-500 text-center">{error}</p>}

              <OtpInput
                length={6}
                onOtpSubmit={(emailOTP) =>
                  setFormData({ ...formData, emailOTP })
                }
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
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
            <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[500] text-[48px]">
              Account created successfully
            </h1>
            <img src={Line1} className="h-auto w-full" />
            <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
              <button
                type="button"
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              >
                <img src={success} alt="success" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
