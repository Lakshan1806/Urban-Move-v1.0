import Logo from "../assets/Urban_Move.svg";
import Line from "../assets/Line.svg";
import { Toast } from "primereact/toast";
import { useState, useRef } from "react";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import getToastSeverity from "../utils/getToastSeverity";

function SignIn() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  console.log(username, password);

  const loginData = {
    username: username,
    password: password,
  };

  const handleSignin = async (event) => {
    event.preventDefault();

    try {
      const loginRes = await axios.post("/admin/login", loginData);
      toast.current.show({
        severity: getToastSeverity(loginRes.status),
        summary: `Login ${loginRes.status}`,
        detail: loginRes.data.message || "Login successful",
        life: 3000,
      });
    } catch (err) {
      const status = err.response?.status;
      toast.current.show({
        severity: getToastSeverity(status || 500),
        summary: status ? `Error ${status}` : "Network Error",
        detail: err.response?.data?.message || err.message,
        life: 4000,
      });
      return;
    }
    let profileRes;
    try {
      profileRes = await axios.get("/admin/profile");
      toast.current.show({
        severity: getToastSeverity(profileRes.status),
        summary: `Profile ${profileRes.status}`,
        detail: profileRes.data.username
          ? `Welcome, ${profileRes.data.username}!`
          : "Profile loaded",
        life: 3000,
      });
    } catch (err) {
      const status = err.response?.status;
      toast.current.show({
        severity: getToastSeverity(status || 500),
        summary: status ? `Error ${status}` : "Network Error",
        detail: err.response?.data?.message || err.message,
        life: 4000,
      });
      return;
    }
    localStorage.setItem("userData", JSON.stringify(profileRes.data));
    setUser(profileRes.data);
    navigate("/dashboard", { replace: true });
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
            onSubmit={handleSignin}
            className="flex flex-col gap-[42px]  items-center "
          >
            <div className="flex flex-col w-[300px]">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
                required
              />
            </div>

            <div className="flex flex-col w-[300px]">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                required
              />
            </div>

            <div className="button-wrapper">
              <button type="submit" className="button-primary">
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
}

export default SignIn;
