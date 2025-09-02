import { useState, useEffect } from "react";
import OtpInput from "./otp-input";
import Line1 from "../signup_photos/liner1.svg";
import arrow from "../signup_photos/arrowvector.svg";
import { FaArrowRight } from "react-icons/fa";

const useCountdown = (initialSeconds = 30) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const start = (time = initialSeconds) => {
    setSecondsLeft(time);
    setIsActive(true);
  };

  const reset = () => {
    setIsActive(false);
    setSecondsLeft(initialSeconds);
  };

  return { secondsLeft, isActive, start, reset };
};

const OtpVerification = ({
  onVerifyOtp,
  onResendOtp,
  error,
  loading,
  title = "Verify your Mobile Number",
  subtitle = "We sent a verification code to your phone",
  otpLength = 6,
  autoStartTimer = true,
}) => {
  const [otp, setOtp] = useState("");

  const {
    secondsLeft: phoneSecondsLeft,
    isActive: isPhoneActive,
    start: startPhoneTimer,
    reset: resetPhoneTimer,
  } = useCountdown(60);

  useEffect(() => {
    if (autoStartTimer) {
      startPhoneTimer();
    }
  }, []);

  const handleOtpSubmit = (otpValue) => {
    setOtp(otpValue);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== otpLength) {
      return;
    }

    try {
      const result = await onVerifyOtp(otp);
      if (result.success) {
        resetPhoneTimer();
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendOtp = async () => {
    if (isPhoneActive) return;

    try {
      await onResendOtp();
      console.log("New OTP sent");
      startPhoneTimer();
    } catch (err) {
      console.error(err.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-35">
      <h1 className="text-grad-stroke text-[36px] font-[300]" data-text={title}>
        {title}
      </h1>
      <p className="text-[20px] font-[700]">{subtitle}</p>
      <img src={Line1} className="h-auto w-full" alt="Line" />

      {error && <p className="text-center text-red-500">{error}</p>}

      <form onSubmit={handleVerifySubmit}>
        <OtpInput
          length={otpLength}
          onOtpSubmit={handleOtpSubmit}
          disabled={loading}
        />
        <div className="mt-4 flex w-full justify-center">
          <div className="button-wrapper">
            <button
              type="submit"
              className="button-primary flex items-center justify-center gap-2"
              disabled={loading || !otp || otp.length !== otpLength}
            >
              {loading ? "VERIFYING..." : "CONTINUE"}
              <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
            </button>
          </div>
        </div>
      </form>

      <button
        onClick={handleResendOtp}
        disabled={isPhoneActive || loading}
        className={`${
          isPhoneActive || loading
            ? "text-gray-400"
            : "bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent"
        }`}
      >
        {isPhoneActive ? `Resend in ${phoneSecondsLeft}s` : "Resend OTP"}
      </button>
    </div>
  );
};

export default OtpVerification;
