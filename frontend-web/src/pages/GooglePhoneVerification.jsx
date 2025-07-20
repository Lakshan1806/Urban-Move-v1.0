import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import OtpInput from "../components/otp-input";
import useCountdown from "../components/hooks/useCountdown";
import Line1 from "../signup_photos/liner1.svg";
import getToastSeverity from "../utils/getToastSeverity";
import { Toast } from "primereact/toast";
import { FaArrowRight } from "react-icons/fa";

const GooglePhoneVerification = () => {
  const { checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
      const response = await axios.post("/auth/google/verify-phone", {
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
        severity: "error",
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
      const response = await axios.post("/auth/google/verify-phone", {
        phoneNumber,
        otp,
      });

      if (response.data.success) {
        toast.current?.show({
          severity: "success",
          summary: "Verification Successful",
          detail: "Phone number verified successfully!",
          life: 3000,
        });
        await checkAuth();
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Failed to verify OTP");
      }
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Verification Failed",
        detail: err.response?.data?.message || "Failed to verify OTP",
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isActive) return;

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
        severity: "error",
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
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-20">
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
                className="button-primary flex gap-2 justify-center items-center"
                disabled={loading}
              >
                {loading ? "SENDING..." : "CONTINUE"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center gap-[25px] w-auto">
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
                {loading ? "VERIFYING..." : "CONTINUE"}
                <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />{" "}
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
      </div>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default GooglePhoneVerification;
