import Logo from "../../assets/Urban_Move.svg";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { useState } from "react";
import axios from "axios";
import { GoPlusCircle } from "react-icons/go";

function AddAdmin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  console.log(username, email);

  const formData = {
    username,
    email,
    role,
  };

  const addAdmin = async (event) => {
    event.preventDefault();
    await axios.post("/admin/add_admin", formData);
  };

  return (
    <div className="col-span-4 row-span-12 flex h-full flex-col justify-center gap-5 rounded p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="flex flex-none flex-row justify-center">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Add admin account"
        >
          Add admin account
        </h1>
      </div>
      <div className="flex flex-row justify-center pb-8">
        <img src={Logo} className="h-[200px] w-[200px]" />
      </div>

      <TfiLayoutLineSolid
        className="block h-12 w-full flex-none [&>path:not([fill='none'])]:fill-[url(#icon-gradient)]"
        preserveAspectRatio="none"
      />
      <div>
        <form onSubmit={addAdmin} className="flex flex-col gap-10 px-8 pb-8">
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="Admin"
                checked={role === "Admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="Super Admin"
                checked={role === "Super Admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              Super Admin
            </label>
          </div>

          <div className="button-wrapper">
            <button
              type="submit"
              className="button-primary flex flex-row items-center justify-center gap-2"
            >
              <GoPlusCircle className="[&>path]:fill-[url(#icon-gradient)]" />
              ADD ADMIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdmin;
