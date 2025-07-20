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
    <div className="flex flex-col items-center justify-center gap-[25px] w-auto pt-20 ">
      <h1
        className="text-grad-stroke font-[300] text-[36px]"
        data-text={title}
      >
        {title}
      </h1>
      <p className="font-[700] text-[20px]">{description}</p>
      <img src={Line1} className="h-auto w-full" />
      {error && <p className="text-red-500 text-center">{error}</p>}

      {showPhoneInput && (
        <input
          type="tel"
          placeholder="Enter your Mobile number"
          value={initialPhoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
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
          className="button-primary flex gap-2 justify-center items-center"
        >
          {continueButtonText}
          <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
        </button>
      </div>

      {onResend && (
        <button
          onClick={onResend}
          disabled={isActive}
          className={`${isActive ? "text-gray-400" : "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"}`}
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
