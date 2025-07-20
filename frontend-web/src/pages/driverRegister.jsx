import React, { useState, useContext, useEffect } from "react";
import { DriverAuthContext } from "../context/driverAuthContext";
import imgd from "../signup_photos/signindriver.svg";
import { Link } from "react-router-dom";
import imgl from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import Line1 from "../signup_photos/liner1.svg";
import OtpInput from "../components/otp-input";
import success from "../signup_photos/success.svg";
import useCountdown from "../components/hooks/useCountdown";
import GoogleLoginButton from "../components/GoogleLoginDriver";
import { FaCheck, FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const DriverRegister = () => {
  const navigate = useNavigate();

  const { register, registrationStep, setRegistrationStep } =
    useContext(DriverAuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    otp: "",
    email: "",
    emailOTP: "",
  });
  const [documents, setDocuments] = useState({
    license: null,
    residency: null,
    insurance: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDocumentChange = (type) => (e) => {
    setDocuments({
      ...documents,
      [type]: e.target.files[0],
    });
  };
  const handleDocumentSubmit = async () => {
    setLoading(true);
    setError("");
    const isPdfFile = (file) => file && file.type === "application/pdf";

    try {
      const files = Object.values(documents).filter(Boolean);
      if (files.length < 3) {
        setError("Please upload all required documents");
        return;
      }
      const nonPdfFiles = files.filter((file) => !isPdfFile(file));
      if (nonPdfFiles.length > 0) {
        setError("Only PDF files are allowed.");
        return;
      }
      const result = await register.uploadDocuments(files);
      if (result.success) {
        setRegistrationStep(7);
      }
    } catch (err) {
      setError(err.message || "Document upload failed");
    } finally {
      setLoading(false);
    }
  };

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
    if (registrationStep === 8) {
      const timeout = setTimeout(() => {
        window.location.href = "http://localhost:5174/";
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [registrationStep, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (registrationStep < 7) {
        register.clearRegistrationSession();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [register, registrationStep]);

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const progress = await register.getProgress();

        if (progress.status !== "new") {
          const step = getStepNumber(progress.nextStep);
          setRegistrationStep(step);
          setFormData((prev) => ({
            ...prev,
            username: progress.username || "",
            phoneNumber: progress.phone || "",
            email: progress.email || "",
          }));
        }
      } catch (error) {
        console.error("Progress check failed:", error);
      }
    };

    checkProgress();
  }, []);

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
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!strongPasswordRegex.test(formData.password)) {
          setError(
            "Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character"
          );
          setLoading(false);
          return;
        }
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
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      {registrationStep === 1 && (
        <img
          src={imgd}
          alt="Signup Background"
          className="absolute z-0  mx-auto w-auto h-[700px] pl-3"
        />
      )}

      <div className="flex flex-col px-0.5 z-10 ">
        <form onSubmit={handleSubmit} className="w-[250px] pt-[70px]">
          {registrationStep === 1 && (
            <>
              <h2 className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[18px] text-center">
                Signup as a driver
              </h2>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[18px] text-start">
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

              <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[18px] text-start">
                Password
              </p>
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
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}

              <div className="button-wrapper">
                <button
                  type="submit"
                  className="button-primary flex gap-2 justify-center items-center"
                  disabled={loading}
                >
                  {loading ? "PROCESSING..." : "SIGN UP"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>

              <img src={imgl} alt="Divider" className="w-full h-auto" />
              <GoogleLoginButton intent="signup" />
              <p className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[16px] text-center">
                <Link to="/signin">Already have an account? Sign in</Link>
              </p>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 2 && (
            <>
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

                <img src={Line1} className="h-auto w-full" />
                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your Mobile number"
                  value={formData.phoneNumber}
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
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 3 && (
            <>
              <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-35">
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
                {error && <p className="text-red-500 text-center">{error}</p>}

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
                  className={`${isPhoneActive || loading ? "text-gray-400" : "text-orange-500"}`}
                >
                  {isPhoneActive
                    ? `Resend in ${phoneSecondsLeft}s`
                    : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 4 && (
            <>
              <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-35">
                <h1
                  className="text-grad-stroke font-[300] text-[36px]"
                  data-text="Enter your Email Address"
                >
                  {" "}
                  Enter your Email Address
                </h1>
                <p className="font-[700] text-[20px]">
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
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 5 && (
            <>
              <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-35">
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
                {error && <p className="text-red-500 text-center">{error}</p>}

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
                  className={`${isEmailActive || loading ? "text-gray-400" : "text-orange-500"}`}
                >
                  {isEmailActive
                    ? `Resend in ${emailSecondsLeft}s`
                    : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </form>
        {registrationStep === 6 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-15">
            <h1
              className="text-grad-stroke font-[300] text-[36px]"
              data-text="Submit Documents"
            >
              Submit Documents
            </h1>
            <img src={Line1} className="h-auto w-full" />

            <div className="flex flex-col gap-4 w-full max-w-md">
              <div
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer"
                onClick={() => document.getElementById("license").click()}
              >
                <div className="text-black-500 text-xl">
                  {documents.license ? <FaCheck /> : <FaFileUpload />}
                </div>

                <label className="flex-1 cursor-pointer">
                  Driver's license
                  {documents.license && (
                    <span className="block text-sm text-gray-500">
                      {documents.license.name}
                    </span>
                  )}
                </label>

                <input
                  type="file"
                  id="license"
                  onChange={handleDocumentChange("license")}
                  className="hidden"
                  accept=".pdf"
                />
              </div>

              <div
                className="flex items-center gap-4 p-3  rounded-lg cursor-pointer"
                onClick={() => document.getElementById("residency").click()}
              >
                <div className="text-black-500 text-xl">
                  {documents.residency ? <FaCheck /> : <FaFileUpload />}
                </div>

                <label className="flex-1 cursor-pointer">
                  Proof of residency
                  {documents.residency && (
                    <span className="block text-sm text-gray-500">
                      {documents.residency.name}
                    </span>
                  )}
                </label>

                <input
                  type="file"
                  id="residency"
                  onChange={handleDocumentChange("residency")}
                  className="hidden"
                  accept=".pdf"
                />
              </div>

              <div
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer"
                onClick={() => document.getElementById("insurance").click()}
              >
                <div className="text-black-500 text-xl">
                  {documents.insurance ? <FaCheck /> : <FaFileUpload />}
                </div>

                <label className="flex-1 cursor-pointer">
                  Insurance of the vechile
                  {documents.insurance && (
                    <span className="block text-sm text-gray-500">
                      {documents.insurance.name}
                    </span>
                  )}
                </label>

                <input
                  type="file"
                  id="insurance"
                  onChange={handleDocumentChange("insurance")}
                  className="hidden"
                  accept=".pdf"
                />
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="button-wrapper">
                <button
                  type="button"
                  onClick={handleDocumentSubmit}
                  className="button-primary flex gap-2 justify-center items-center"
                  disabled={
                    loading ||
                    Object.values(documents).filter(Boolean).length < 3
                  }
                >
                  {loading ? "UPLOADING..." : "CONTINUE"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
            </div>
          </div>
        )}
        {registrationStep === 7 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-35">
            <h1
              className="text-grad-stroke font-[300] text-[36px]"
              data-text="Account Verification Pending"
            >
              Account Verification Pending
            </h1>
            <img src={Line1} className="h-auto w-full" />

            <p className="text-center max-w-md font-semibold">
              Thank you for submitting your documents. Your account will be
              reviewed by the admin for verification. You will be notified once
              your account is approved.
            </p>

            <div className="button-wrapper">
              <button
                type="button"
                onClick={() => setRegistrationStep(8)}
                className="button-primary flex gap-2 justify-center items-center"
              >
                CONTINUE
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>
          </div>
        )}
        {registrationStep === 8 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-35">
            <h1
              className="text-grad-stroke font-[300] text-[36px]"
              data-text="Account created successfully"
            >
              Account created successfully
            </h1>
            <img src={Line1} className="h-auto w-full" />
            <div className="button-wrapper">
              <button type="button" className="button-primary ">
                <img src={success} alt="success" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRegister;
