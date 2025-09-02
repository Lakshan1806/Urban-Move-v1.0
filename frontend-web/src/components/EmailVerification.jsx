import OtpInput from "./otp-input";
import Line1 from "../signup_photos/liner1.svg";
import arrow from "../signup_photos/arrowvector.svg";

const EmailVerification = ({
  title = "verify your Email Address",
  description = "We will send a verification code to this email",
  onContinue,
  onResend,
  isActive,
  secondsLeft,
  error,
  initialEmail,
  onEmailChange,
  showEmailInput = false,
  otpLength = 6,
  onOtpSubmit,
  continueButtonText = "continue",
}) => {
  return (
    <div className="flex w-auto flex-col items-center justify-center gap-[25px]">
      <h1 className="flex flex-col items-center text-[48px] font-[400] [-webkit-text-stroke:1px_rgb(255,124,29)]">
        {title}
      </h1>
      <p className="text-[20px] font-[700]">{description}</p>
      <img src={Line1} className="h-auto w-full" />
      {error && <p className="text-center text-red-500">{error}</p>}

      {showEmailInput && (
        <input
          type="email"
          placeholder="Enter your email address"
          value={initialEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-80 rounded border border-[#FFD12E] bg-white p-2"
          required
        />
      )}

      {!showEmailInput && (
        <OtpInput length={otpLength} onOtpSubmit={onOtpSubmit} />
      )}

      <div className="flex max-w-[160px] items-center justify-center rounded-[50px] bg-black px-[22px] py-[5px] text-[20px]">
        <button
          type="button"
          onClick={onContinue}
          className="cursor-pointer bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-transparent"
        >
          {continueButtonText}
        </button>
        <img src={arrow} className="pt-1 pl-1" />
      </div>

      {onResend && (
        <button
          onClick={onResend}
          disabled={isActive}
          className={`${isActive ? "text-gray-400" : "text-orange-500"}`}
        >
          {isActive
            ? `Resend in ${secondsLeft}s`
            : "Didn't receive code? Resend"}
        </button>
      )}
    </div>
  );
};

export default EmailVerification;
