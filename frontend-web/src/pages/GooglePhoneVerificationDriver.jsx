import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { DriverAuthContext } from "../context/driverAuthContext";
import OtpInput from "../components/otp-input";
import useCountdown from "../components/hooks/useCountdown";
import Line1 from "../signup_photos/liner1.svg";
import arrow from "../signup_photos/arrowvector.svg";
import { FaCheck, FaFileUpload } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const GooglePhoneVerification = () => {
  const { checkAuth } = useContext(DriverAuthContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState({
    license: null,
    residency: null,
    insurance: null,
  });
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    secondsLeft,
    isActive,
    start: startTimer,
    reset: resetTimer,
  } = useCountdown(60);

  const handleSendOtp = async () => {
    setError("");
    try {
      const response = await axios.post("/auth/google/verify-phone-driver", {
        phoneNumber,
      });

      if (response.data.success) {
        toast.success("OTP sent to your phone");
        startTimer();
        setStep(2);
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    try {
      const response = await axios.post("/auth/google/verify-phone-driver", {
        phoneNumber,
        otp,
      });

      if (response.data.success) {
        if (response.data.requireDocuments) {
          toast.success("OTP verified! Please upload your documents");
          setOtpVerified(true);
          setStep(3);
        } else {
          toast.success("Phone verification successful!");
          window.location.href = "http://localhost:5174";
        }
      } else {
        throw new Error(response.data.message || "Failed to verify OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
      toast.error(err.response?.data?.message || "Failed to verify OTP");
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
      setError("Please upload all required documents");
      return;
    }

    const nonPdfFiles = files.filter((file) => !isPdfFile(file));
    if (nonPdfFiles.length > 0) {
      setError("Only PDF files are allowed.");
      return;
    }

    setError("");
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
        toast.success(
          "Documents uploaded successfully! Registration complete."
        );
        window.location.href = "http://localhost:5174";
      } else {
        throw new Error(response.data.message || "Failed to upload documents");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload documents");
      toast.error(err.response?.data?.message || "Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isActive) return;
    setError("");
    try {
      const response = await axios.post("/auth/resend-otp", {
        phone: phoneNumber,
      });

      if (response.data.message.includes("sent to phone")) {
        toast.success("New OTP sent to your phone");
        startTimer();
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      toast.error(err.response?.data?.message || "Failed to resend OTP");
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
            {error && <p className="text-red-500 text-center">{error}</p>}

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
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
            <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
              verify your Mobile Number
            </h1>
            <p className="font-[700] text-[20px]">
              We will send a verification code to this number
            </p>
            <img src={Line1} className="h-auto w-full" />
            {error && <p className="text-red-500 text-center">{error}</p>}

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

              {error && <p className="text-red-500 text-center">{error}</p>}

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
    </div>
  );
};

export default GooglePhoneVerification;
