import Logo from "../assets/Urban_Move.svg";
import Line from "../assets/Line.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token); // Store token
      setAuth(true); // Update authentication state
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-svh">
      <div className="max-w-[340px] flex flex-col items-center gap-[42px]">
        <div className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          <h1>Administrator</h1>
          <h1>Sign In</h1>
        </div>

        <img src={Logo} className="w-[200px] h-[200px]" />
        <img src={Line} />

        <div>
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-[42px]  items-center "
          >
            <div className="flex flex-col w-[300px]">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col w-[300px]">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="bg-black rounded-[50px] max-w-[115px] flex justify-center px-[22px] py-[10px] text-[20px]">
              <button
                type="submit"
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text "
              >
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
