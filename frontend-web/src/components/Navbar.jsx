import { Link } from "react-router-dom";
import Logo from "../assets/Urban_Move_Colour.svg";

function NavBar() {
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/rent", label: "Rent" },
    { path: "/drive", label: "Drive" },
    { path: "/ride", label: "Ride" },
    { path: "/help", label: "Help" },
  ];

  const accAuth = [
    { path: "/signup", label: "Sign Up" },
    { path: "/signin", label: "Sign In" },
  ];

  const linkstyles1 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase";

  const linkstyles2 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase rounded-[50px] ";

  return (
    <nav className="bg-black w-screen h-[80px] flex flrx-row items-center py-[10px] px-[40px] justify-between">
      <header>
        <img src={Logo} alt="Logo" className="w-[60px] h-[60px]" />
      </header>
      <div className="flex gap-[40px]">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className={linkstyles1}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-[10px] ">
        {accAuth.map((item) => (
          <Link to={item.path} key={item.path} className={linkstyles2}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default NavBar;
