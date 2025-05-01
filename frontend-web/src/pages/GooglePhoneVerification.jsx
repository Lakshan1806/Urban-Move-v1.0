import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PhoneVerification from "../components/phoneVerification.jsx";
import useOtpVerification from "../components/hooks/useOtpVerification.js";

const GooglePhoneVerification = () => {
  const { checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    error,
    step,
    secondsLeft,
    isActive,
    sendOtp,
    verifyOtp,
    resendOtp,
  } = useOtpVerification();

  const handleSendOtp = () => sendOtp("/auth/google/verify-phone");

  const handleVerifyOtp = async () => {
    const success = await verifyOtp("/auth/google/verify-phone", async () => {
      await checkAuth();
      navigate("/");
    });
    if (!success) return;
  };

  const handleResendOtp = () => resendOtp("/auth/resend-otp");

  return (
    <div className="flex flex-col items-center px-0 py-0 h-full overflow-auto min-h-0">
      <div className="flex flex-col px-0.5 z-10 pt-[130px]">
        <PhoneVerification
          title={
            step === 1
              ? "Enter your Mobile Number"
              : "verify your Mobile Number"
          }
          onContinue={step === 1 ? handleSendOtp : handleVerifyOtp}
          onResend={step === 2 ? handleResendOtp : null}
          isActive={isActive}
          secondsLeft={secondsLeft}
          error={error}
          initialPhoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          showPhoneInput={step === 1}
          onOtpSubmit={setOtp}
        />
      </div>
    </div>
  );
};

export default GooglePhoneVerification;
