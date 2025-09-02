import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useContext(AuthContext);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!strongPasswordRegex.test(password)) {
      setLocalError(
        "Password must be at least 6 characters and include: uppercase, lowercase, number, and special character",
      );
      return;
    }
    try {
      await resetPassword(token, password);

      console.log("Password reset successfully, redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error.message || "Error resetting password");
    }
  };

  return (
    <div className="mx-auto mt-44 max-w-md rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="p-8">
        <h2 className="mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-center text-3xl font-bold text-transparent">
          Reset Password
        </h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        {message && <p className="mb-4 text-sm text-green-500">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-lg bg-gray-700 p-3 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full rounded-lg bg-gray-700 p-3 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />

          <button
            className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text px-4 py-3 font-bold text-transparent"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
