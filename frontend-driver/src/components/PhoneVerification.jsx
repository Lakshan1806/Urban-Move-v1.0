import OtpInput from "./otp-input";
import Line1 from "../assets/liner1.svg";
import { FaArrowRight } from "react-icons/fa";

const PhoneVerification = ({
  title = "verify your Mobile Number",
  description = "We will send a verification code to this number",
  onContinue,
  onResend,
  isActive,
  secondsLeft,
  error,
  initialPhoneNumber,
  onPhoneNumberChange,
  showPhoneInput = false,
  otpLength = 6,
  onOtpSubmit,
  continueButtonText = "continue",
}) => {
  return (
    <div className="flex w-auto flex-col items-center justify-center gap-[25px] pt-20">
      <h1 className="text-grad-stroke text-[36px] font-[300]" data-text={title}>
        {title}
      </h1>
      <p className="text-[20px] font-[700]">{description}</p>
      <img src={Line1} className="h-auto w-full" />
      {error && <p className="text-center text-red-500">{error}</p>}

      {showPhoneInput && (
        <input
          type="tel"
          placeholder="Enter your Mobile number"
          value={initialPhoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className="w-80 rounded border border-[#FFD12E] bg-white p-2"
          required
        />
      )}

      {!showPhoneInput && (
        <OtpInput length={otpLength} onOtpSubmit={onOtpSubmit} />
      )}

      <div className="button-wrapper">
        <button
          type="button"
          onClick={onContinue}
          className="button-primary flex items-center justify-center gap-2"
        >
          {continueButtonText}
          <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
        </button>
      </div>

      {onResend && (
        <button
          onClick={onResend}
          disabled={isActive}
          className={`${isActive ? "text-gray-400" : "cursor-pointer bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-transparent"}`}
        >
          {isActive
            ? `Resend in ${secondsLeft}s`
            : "Didn't receive code? Resend"}
        </button>
      )}
    </div>
  );
};

export default PhoneVerification;
