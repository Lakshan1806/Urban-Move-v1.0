import { Link } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/Urban_Move_Colour.svg";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { TbCarSuvFilled } from "react-icons/tb";
import { BsPersonBadge } from "react-icons/bs";
import { BsPersonBadgeFill } from "react-icons/bs";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaUserShield } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import Roles from "../context/roles";

function Navbar() {
  const { setUser, user } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("Navbar is rendering");

  async function handleSignout() {
    localStorage.removeItem("userData");
    await axios.post("/admin/logout", {});
    setUser(null);
    navigate("/", { replace: true });
  }

  const navItems = [
    { path: "/dashboard", label: "Home", Icon: MdOutlineMapsHomeWork },
    { path: "/dashboard/rentals", label: "Rentals", Icon: TbCarSuvFilled },
    { path: "/dashboard/customers", label: "Customers", Icon: BsPersonBadge },
    { path: "/dashboard/drivers", label: "Drivers", Icon: BsPersonBadgeFill },

    {
      path: "/dashboard/account",
      label: "Account",
      Icon: IoPersonCircleOutline,
    },
    {
      path: "/dashboard/settings",
      label: "Administration",
      Icon: FaUserShield,
      allowedRole: Roles.SUPER_ADMIN,
    },
  ];

  return (
    <nav className="sticky top-0 bottom-0 flex h-dvh flex-col items-center justify-between bg-black py-5">
      <header>
        <img src={Logo} alt="Logo" className="h-[139px] w-[148px]" />
      </header>

      <div className="flex min-h-[500px] flex-col justify-between">
        {navItems
          .filter(
            (item) =>
              !item.allowedRole || (user && user.role === item.allowedRole),
          )
          .map(({ path, label, Icon }) => {
            return (
              <Link
                to={path}
                key={path}
                className="button-primary flex items-center gap-4"
              >
                <Icon className="[&>path:not([fill='none'])]:fill-[url(#icon-gradient)]" />
                {label}
              </Link>
            );
          })}
      </div>

      <div
        className="button-primary flex justify-center"
        onClick={handleSignout}
      >
        Sign out
      </div>
    </nav>
  );
}

export default Navbar;
