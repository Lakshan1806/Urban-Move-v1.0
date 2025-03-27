/* import React, { useState, useContext } from "react";


import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imgc from "../signup_photos/signupcustomer.svg";
import { Link } from "react-router-dom";
import imgl from "../signup_photos/linervector.svg";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    otp: "",
    email: "",
    emailOTP: "",
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
          "http://localhost:5000/api/auth/register",
          {
            username: formData.username,
            password: formData.password,
          },
          { withCredentials: true }
        );
        setStep(2);
      } else if (step === 2) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            phoneNumber: formData.phoneNumber,
          },
          { withCredentials: true }
        );
        setStep(3);
      } else if (step === 3) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            otp: formData.otp,
          },
          { withCredentials: true }
        );
        setStep(4);
      } else if (step === 4) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            email: formData.email,
          },
          { withCredentials: true }
        );
        setStep(5);
      } else if (step === 5) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            emailOTP: formData.emailOTP,
          },
          { withCredentials: true }
        );

        await register(formData);
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center  px-0 py-0">
      <img src={imgc} alt="imgc" className=" absolute z-0 w-full h-auto " />
        <div className="flex flex-col px-0.5 h-[518px] w-[340px] z-10 pt-[130px] ">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {step === 1 && (
              
              <>
              <div>
              <h2 className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
              Signup as a customer
            </h2>
                <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
                  username
                </p>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className=" bg-white w-full p-2 mb-0.5  border rounded border-[#FFD12E]"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
                  password
                </p>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your Password"
                  value={formData.password}
                  onChange={handleChange}
                  className=" bg-white w-full p-2 border rounded"
                  required
                />
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={
                      "pt-[10px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] cursor-pointer"
                    }
                  >
                    SIGN UP
                  </button>
                </div>
                <img src={imgl} alt="img1" className="w-full h-auto" />
                <p className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
                  <Link>Already have an account? Sign in</Link>
                </p>
                </div>
              </>
            )}
          </form>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 2 && (
              <>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  send otp
                </button>
              </>
            )}
          </form>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 3 && (
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
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 4 && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded"
                >
                  send Email OTP
                </button>
              </>
            )}
          </form>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 5 && (
              <>
                <input
                  type="text"
                  name="emailOTP"
                  placeholder="Enter Email OTP"
                  value={formData.emailOTP}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded"
                >
                  Complete Registration
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
 */
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import imgc from "../signup_photos/signupcustomer.svg"; // Signup background image
import { Link } from "react-router-dom";
import imgl from "../signup_photos/linervector.svg"; // Divider line image
import arrow from "../signup_photos/arrowvector.svg";
import Line1 from "../signup_photos/liner1.svg";
import OtpInput from "../components/otp-input";
import success from "../signup_photos/successc.svg"

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    otp: "",
    email: "",
    emailOTP: "",
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
          "http://localhost:5000/api/auth/register",
          {
            username: formData.username,
            password: formData.password,
          },
          { withCredentials: true }
        );
        setStep(2);
      } else if (step === 2) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            phoneNumber: formData.phoneNumber,
          },
          { withCredentials: true }
        );
        setStep(3);
      } else if (step === 3) {
         await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            otp: formData.otp,
          },
          { withCredentials: true }
        ); 
        setStep(4);
      } else if (step === 4) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            email: formData.email,
          },
          { withCredentials: true }
        );
        setStep(5);
      } else if (step === 5) {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            emailOTP: formData.emailOTP,
          },
          { withCredentials: true }
        );

        setStep(6); // Move to step 6 (Account successfully created)

        // Delay navigation to login
        setTimeout(() => {
          register(formData);
          navigate("/signin");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className=" flex flex-col items-center px-0 py-0 ">
      {step === 1 && (
        <img
          src={imgc}
          alt="Signup Background"
          className="absolute z-0 w-full h-auto"
        />
      )}

      <div className="flex flex-col px-0.5  z-10 pt-[130px]">
        <form onSubmit={handleSubmit} className="w-[340px]">
          {step === 1 && (
            <>
              <h2 className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
                Signup as a Customer
              </h2>

              <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
                Username
              </p>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="bg-white w-full p-2 border rounded border-[#FFD12E]"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <p className="pt-[10px] mb-0 font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-start">
                Password
              </p>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="bg-white w-full p-2 border rounded border-[#FFD12E]"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="pt-[10px] pb-[10px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] cursor-pointer"
                >
                  SIGN UP
                </button>
              </div>

              <img src={imgl} alt="Divider" className="w-full h-auto" />

              <p className="pt-[15px] font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text font-[400] text-[20px] text-center">
                <Link to="/signin">Already have an account? Sign in</Link>
              </p>
            </>
          )}
        </form>
        <form onSubmit={handleSubmit}>
          {step === 2 && (
            <>
              <div className="flex flex-col items-center justify-center  gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  Enter your Mobile Number
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this number
                </p>
                <img src={Line1} className="h-auto w-full" />

                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your Mobile number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
                  required
                />
                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                  >
                    continue
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
              </div>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit} >
          {step === 3 && (
            <>
              <div className="flex flex-col items-center justify-center  gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  verify your Mobile Number
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this number
                </p>
                <img src={Line1} className="h-auto w-full" />
                <OtpInput
                  length={6}
                  onOtpSubmit={(otp) => setFormData({ ...formData, otp })}
                />

                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                  >
                    continue
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
              </div>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit}>
          {step === 4 && (
            <>
              <div className="flex flex-col items-center justify-center  gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[500] text-[48px]">
                  Enter your Email Address
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this email
                </p>
                <img src={Line1} className="h-auto w-full" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white w-80 p-2 border rounded border-[#FFD12E]"
                  required
                />
                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                  >
                    continue
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
              </div>
            </>
          )}
        </form>

        <form onSubmit={handleSubmit} >
          {step === 5 && (
            <>
              <div className="flex flex-col items-center justify-center  gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[400] text-[48px]">
                  verify your email address
                </h1>
                <p className="font-[700] text-[20px]">
                  We will send a verification code to this email
                </p>
                <img src={Line1} className="h-auto w-full" />
                <OtpInput
                  length={6}
                  onOtpSubmit={(emailOTP) => setFormData({ ...formData, emailOTP})}
                />

                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="submit"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                  >
                    continue
                  </button>
                  <img src={arrow} className="pl-1 pt-1" />
                </div>
              </div>
            </>
          )}
        </form>
        <form >
          {step === 6 && (
            <>
              <div className="flex flex-col items-center justify-center  gap-[25px] w-auto">
                <h1 className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[500] text-[48px]">
                  Account created successfully
                </h1>
                
                <img src={Line1} className="h-auto w-full" />

                
                <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
                  <button
                    type="button"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                    disabled
                  >
                   <img src={success}  alt="success"/>
                  </button>
                  
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
