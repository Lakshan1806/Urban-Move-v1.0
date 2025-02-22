import { Link } from "react-router-dom";
import Logo from "../assets/Urban_Move_Colour.svg";

function Navbar() {
  console.log("Navbar is rendering");

  const navItems = [
    { path: "/home", label: "Home" },
    { path: "/rides", label: "Rides" },
    { path: "/rentals", label: "Rentals" },
    { path: "/customers", label: "Customers" },
    { path: "/drivers", label: "Drivers" },
    { path: "/financials", label: "Financials" },
    { path: "/messages", label: "Messages" },
    { path: "/account", label: "Account" },
    { path: "/settings", label: "Settings" },
  ];
  const Linkstyles =
    "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text";


  
  return (
    <nav className="bg-black h-screen w-[200px] flex flex-col items-center py-5 justify-between">
      <header>
        <img src={Logo} alt="Logo" className="w-[148px] h-[139px]" />
      </header>
      <div className="flex flex-col min-h-[500px] justify-between ">
      <div className="flex flex-col min-h-[500px] justify-between ">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className={Linkstyles}>{item.label}</Link>
        ))}
      </div>

      </div>
      <div className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text pt-[20px]">
        Sign out
      </div>
    </nav>
  );
}

export default Navbar;
