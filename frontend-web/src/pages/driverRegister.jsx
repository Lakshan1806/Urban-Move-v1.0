import { useState, useContext, useEffect, useRef } from "react";
import { DriverAuthContext } from "../context/driverAuthContext";
import imgd from "../signup_photos/signindriver.svg";
import { Link } from "react-router-dom";
import imgl from "../signup_photos/linervector.svg";
import Line1 from "../signup_photos/liner1.svg";
import OtpInput from "../components/otp-input";
import success from "../signup_photos/success.svg";
import useCountdown from "../components/hooks/useCountdown";
import GoogleLoginButton from "../components/GoogleLoginDriver";
import { FaCheck, FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import getToastSeverity from "../utils/getToastSeverity";
import { Toast } from "primereact/toast";

const DriverRegister = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

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

  const [loading, setLoading] = useState(false);

  const handleDocumentChange = (type) => (e) => {
    setDocuments({
      ...documents,
      [type]: e.target.files[0],
    });
  };
  const handleDocumentSubmit = async () => {
    setLoading(true);
    const isPdfFile = (file) => file && file.type === "application/pdf";

    try {
      const files = Object.values(documents).filter(Boolean);
      if (files.length < 3) {
        toast.current?.show({
          severity: "warn",
          summary: "Missing Documents",
          detail: "Please upload all required documents",
          life: 4000,
        });
        return;
      }
      const nonPdfFiles = files.filter((file) => !isPdfFile(file));
      if (nonPdfFiles.length > 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Invalid File Type",
          detail: "Only PDF files are allowed.",
          life: 4000,
        });
        return;
      }
      const result = await register.uploadDocuments(files);
      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Upload Successful",
          detail: result.data?.message || "documents upload successful",
          life: 3000,
        });
        setRegistrationStep(7);
      }
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Upload Failed",
        detail: err.message || "Document upload failed",
        life: 4000,
      });
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
      toast.current?.show({
        severity: "success",
        summary: "Account create Successful",
        detail: "Welcome! You have been Account created in successfully",
        life: 3000,
      });
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
          toast.current?.show({
            severity: "warn",
            summary: "Invalid Password",
            detail:
              "Password must be at least 6 characters long, contain uppercase and lowercase letters, a number, and a special character",
            life: 4000,
          });
          setLoading(false);
          return;
        }
        await register.start(formData.username, formData.password);
        toast.current?.show({
          severity: "success",
          summary: "Account Created",
          detail: "Username and password set successfully",
          life: 3000,
        });
      } else if (registrationStep === 2) {
        if (!validateSriLankanPhone(formData.phoneNumber)) {
          toast.current?.show({
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
      toast.current?.show({
        severity: getToastSeverity(err.response?.status || 500),
        summary: err.response?.status
          ? `Error ${err.response.status}`
          : "Registration Error",
        detail: err.message || "Registration failed. Please try again.",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col items-center overflow-auto px-0 py-0">
      {registrationStep === 1 && (
        <img
          src={imgd}
          alt="Signup Background"
          className="absolute z-0 mx-auto h-[700px] w-auto pl-3"
        />
      )}

      <div className="z-10 flex flex-col px-0.5">
        <form onSubmit={handleSubmit} className="w-[250px] pt-[70px]">
          {registrationStep === 1 && (
            <>
              <h2 className="bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text pt-[15px] text-center font-sans text-[18px] font-[400] text-transparent">
                Signup as a driver
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

              <div className="button-wrapper my-2">
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
              <p className="bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text pt-[15px] text-center font-sans text-[16px] font-[400] text-transparent">
                <Link to="/signin">Already have an account? Sign in</Link>
              </p>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 2 && (
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
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your Mobile number"
                  value={formData.phoneNumber}
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
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 3 && (
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
              <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
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
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {registrationStep === 5 && (
            <>
              <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
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
          <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-15">
            <h1
              className="text-grad-stroke text-[36px] font-[300]"
              data-text="Submit Documents"
            >
              Submit Documents
            </h1>
            <img src={Line1} className="h-auto w-full" />

            <div className="flex w-full max-w-md flex-col gap-4">
              <div
                className="flex cursor-pointer items-center gap-4 rounded-lg p-3"
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
                className="flex cursor-pointer items-center gap-4 rounded-lg p-3"
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
                className="flex cursor-pointer items-center gap-4 rounded-lg p-3"
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

              <div className="button-wrapper">
                <button
                  type="button"
                  onClick={handleDocumentSubmit}
                  className="button-primary flex items-center justify-center gap-2"
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
          <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
            <h1
              className="text-grad-stroke text-[36px] font-[300]"
              data-text="Account Verification Pending"
            >
              Account Verification Pending
            </h1>
            <img src={Line1} className="h-auto w-full" />

            <p className="max-w-md text-center font-semibold">
              Thank you for submitting your documents. Your account will be
              reviewed by the admin for verification. You will be notified once
              your account is approved.
            </p>

            <div className="button-wrapper">
              <button
                type="button"
                onClick={() => setRegistrationStep(8)}
                className="button-primary flex items-center justify-center gap-2"
              >
                CONTINUE
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>
          </div>
        )}
        {registrationStep === 8 && (
          <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
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

export default DriverRegister;
