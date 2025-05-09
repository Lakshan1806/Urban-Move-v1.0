import Logo from "../../assets/Urban_Move.svg";
import Line from "../../assets/Line.svg";
import { useState } from "react";
import axios from "axios";
import { IoAddCircle } from "react-icons/io5";

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
    <div className="col-span-4 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col h-full justify-center items-stretch gap-10">
      <div className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
        <h1>Add admin account</h1>
      </div>
      <div className="flex flex-row justify-center">
        <img src={Logo} className="w-[200px] h-[200px]" />
      </div>

      <img src={Line} />

      <div>
        <form onSubmit={addAdmin} className="flex flex-col gap-10 p-8">
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
              className="button-primary flex flex-row items-center gap-2"
            >
              <IoAddCircle className="fill-[#FF7C1D]" />
              ADD ADMIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAdmin;
