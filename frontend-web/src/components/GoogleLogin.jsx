import imgg from "../signup_photos/googlelogo.svg";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton({ intent = "login" }) {
  const { loginWithGoogle } = useAuth();

  const handleClick = () => {
    try {
      loginWithGoogle(intent);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-3 flex w-full cursor-pointer items-center justify-center rounded border border-[#FFD12E] bg-white p-1 text-center"
    >
      <>
        <img src={imgg} alt="Google" className="mr-2 inline-block h-5 w-5" />
        {intent === "signup" ? "Sign up with Google" : "Sign in with Google"}
      </>
    </button>
  );
}
