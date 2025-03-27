import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    otp: "",
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (step === 1) {
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            username: formData.username,
            password: formData.password,
          },
          { withCredentials: true }
        );
        setStep(2);
      } else if (step === 2) {
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            otp: formData.otp,
          },
          { withCredentials: true }
        );
        await login(formData);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
                
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
                
              >
                verify otp
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
