import Logo from "../assets/Urban_Move.svg";
import { TfiLayoutLineSolid } from "react-icons/tfi";
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
    <div className="flex h-svh items-center justify-center">
      <div className="flex max-w-[340px] flex-col items-center gap-[42px]">
        <div className="flex flex-col items-center text-[36px] font-[700]">
          <h1 className="text-grad-stroke" data-text="Administrator">
            Administrator
          </h1>
          <h1 className="text-grad-stroke" data-text="Sign In">
            Sign In
          </h1>
        </div>

        <img src={Logo} className="h-[200px] w-[200px]" />

        <TfiLayoutLineSolid
          className="block h-12 w-full [&>path:not([fill='none'])]:fill-[url(#icon-gradient)]"
          preserveAspectRatio="none"
        />

        <div>
          <form
            onSubmit={handleSignin}
            className="flex flex-col items-center gap-[42px]"
          >
            <div className="flex w-[300px] flex-col">
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

            <div className="flex w-[300px] flex-col">
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
