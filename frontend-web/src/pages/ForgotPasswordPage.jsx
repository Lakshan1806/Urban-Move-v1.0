import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="mx-auto mt-44 max-w-md rounded-2xl bg-gray-800 shadow-lg">
      <div className="p-8">
        <h2 className="mb-6 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-center text-3xl font-bold text-transparent">
          Forgot Password
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <p className="mb-6 text-center text-gray-300">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full rounded-lg bg-gray-700 p-3 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
            <button
              className="w-full cursor-pointer bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text px-4 py-3 text-transparent"
              type="submit"
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <p className="mb-6 text-gray-300">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
          </div>
        )}
      </div>

      <div className="bg-opacity-50 flex justify-center bg-gray-900 px-8 py-4">
        <Link
          to={"/login"}
          className="flex items-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-sm text-transparent hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
