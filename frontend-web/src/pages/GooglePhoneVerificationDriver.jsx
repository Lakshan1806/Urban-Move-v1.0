import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import { DriverAuthContext } from "../context/driverAuthContext";
import OtpInput from "../components/otp-input";
import useCountdown from "../components/hooks/useCountdown";
import Line1 from "../signup_photos/liner1.svg";
import { FaCheck, FaFileUpload } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import getToastSeverity from "../utils/getToastSeverity";

const GooglePhoneVerification = () => {
  const { checkAuth } = useContext(DriverAuthContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState({
    license: null,
    residency: null,
    insurance: null,
  });
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const toast = useRef(null);

  const {
    secondsLeft,
    isActive,
    start: startTimer,
    reset: resetTimer,
  } = useCountdown(60);

  const validateSriLankanPhone = (phone) => {
    const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    if (!validateSriLankanPhone(phoneNumber)) {
      toast.current?.show({
        severity: "warn",
        summary: "Invalid Phone Number",
        detail:
          "Please enter a valid Sri Lankan phone number (0XXXXXXXXX or +94XXXXXXXXX)",
        life: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/google/verify-phone-driver", {
        phoneNumber,
      });

      if (response.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "OTP Sent",
          detail: "Verification code sent to your phone",
          life: 3000,
        });
        startTimer();
        setStep(2);
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.current?.show({
        severity: getToastSeverity(err.response?.status),
        summary: "Send OTP Failed",
        detail: err.response?.data?.message || "Failed to send OTP",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.current?.show({
        severity: "warn",
        summary: "Invalid OTP",
        detail: "Please enter a valid 6-digit OTP",
        life: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/google/verify-phone-driver", {
        phoneNumber,
        otp,
      });

      if (response.data.success) {
        if (response.data.requireDocuments) {
          toast.current?.show({
            severity: "success",
            summary: "OTP Verified",
            detail: "Phone verified! Please upload your documents",
            life: 3000,
          });
          setOtpVerified(true);
          setStep(3);
        } else {
          toast.current?.show({
            severity: "success",
            summary: "Verification Successful",
            detail: "Phone verification completed successfully!",
            life: 3000,
          });
          setTimeout(() => {
            window.location.href = "http://localhost:5174";
          }, 1500);
        }
      } else {
        throw new Error(response.data.message || "Failed to verify OTP");
      }
    } catch (err) {
      toast.current?.show({
        severity: getToastSeverity(err.response?.status),
        summary: "Verification Failed",
        detail: err.response?.data?.message || "Failed to verify OTP",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDocumentChange = (type) => (e) => {
    setDocuments({
      ...documents,
      [type]: e.target.files[0],
    });
  };
  const handleDocumentUpload = async () => {
    const isPdfFile = (file) => file && file.type === "application/pdf";

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
        summary: "Invalid File Format",
        detail: "Only PDF files are allowed",
        life: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("otp", "verified");

      formData.append("phoneNumber", phoneNumber);

      files.forEach((doc) => {
        formData.append("documents", doc);
      });

      const response = await axios.post(
        "/auth/google/verify-phone-driver",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && response.data.redirect) {
        toast.current?.show({
          severity: "success",
          summary: "Upload Successful",
          detail: "Documents uploaded successfully! Registration complete",
          life: 3000,
        });
        setTimeout(() => {
          window.location.href = "http://localhost:5174";
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to upload documents");
      }
    } catch (err) {
      toast.current?.show({
        severity: getToastSeverity(err.response?.status),
        summary: "Upload Failed",
        detail: err.response?.data?.message || "Failed to upload documents",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isActive) return;
    setLoading(true);
    try {
      const response = await axios.post("/auth/resend-otp", {
        phone: phoneNumber,
      });

      if (response.data.message.includes("sent to phone")) {
        toast.current?.show({
          severity: "success",
          summary: "OTP Resent",
          detail: "New verification code sent to your phone",
          life: 3000,
        });
        startTimer();
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.current?.show({
        severity: getToastSeverity(err.response?.status),
        summary: "Resend Failed",
        detail: err.response?.data?.message || "Failed to resend OTP",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      <div className="flex flex-col px-0.5 z-10 pt-[130px]">
        {step === 1 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto p-20">
            <h1
              className="text-grad-stroke font-[300] text-[36px]"
              data-text="Enter your Mobile Number"
            >
              Enter your Mobile Number
            </h1>
            <p className="font-[700] text-[20px] ">
              We will send a verification code to this number
            </p>

            <img src={Line1} className="h-auto w-full" />

            <input
              type="text"
              placeholder="Enter your Mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
              required
            />
            <div className="button-wrapper">
              <button
                type="button"
                onClick={handleSendOtp}
                className="button-primary flex gap-2 justify-center items-center "
                disabled={loading}
              >
                {loading ? "SENDING..." : "CONTINUE"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />{" "}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-20">
            <h1
              className="text-grad-stroke font-[300] text-[36px]"
              data-text="verify your Mobile Number"
            >
              verify your Mobile Number
            </h1>
            <p className="font-[700] text-[20px]">
              We will send a verification code to this number
            </p>
            <img src={Line1} className="h-auto w-full" />

            <OtpInput length={6} onOtpSubmit={(code) => setOtp(code)} />

            <div className="button-wrapper">
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="button-primary flex gap-2 justify-center items-center"
                disabled={loading}
              >
                {loading ? "SENDING..." : "CONTINUE"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>
            <button
              onClick={handleResendOtp}
              disabled={isActive}
              className={`${isActive ? "text-gray-400" : "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"}`}
            >
              {isActive ? `Resend in ${secondsLeft}s` : "Resend"}
            </button>
          </div>
        )}
        {step === 3 && (
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
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer"
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
                  Insurance of the vehicle
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
                  onClick={handleDocumentUpload}
                  disabled={
                    loading ||
                    Object.values(documents).filter(Boolean).length < 3
                  }
                  className="button-primary flex gap-2 justify-center items-center"
                >
                  {loading ? "UPLOADING..." : "CONTINUE"}
                  <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default GooglePhoneVerification;
