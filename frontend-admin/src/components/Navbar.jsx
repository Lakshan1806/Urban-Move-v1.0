import { Link } from "react-router-dom";
import Logo from "../assets/Urban_Move_Colour.svg";

function Navbar() {
  console.log("Navbar is rendering");

  
  return (
    <nav className="bg-black h-screen w-[200px] flex flex-col items-center py-5 justify-between">
      <header>
        <img src={Logo} alt="Logo" className="w-[148px] h-[139px]" />
      </header>
      <div className="flex flex-col min-h-[500px] justify-between ">
        <Link
          to="/home"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Home
        </Link>
        <Link
          to="/rides"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Rides
        </Link>
        <Link
          to="/rentals"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Rentals
        </Link>
        <Link
          to="/customers"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Customers
        </Link>
        <Link
          to="/drivers"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Drivers
        </Link>
        <Link
          to="/financials"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Financials
        </Link>
        <Link
          to="/messages"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Messages
        </Link>
        <Link
          to="/account"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Account
        </Link>
        <Link
          to="/settings"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D]  text-transparent bg-clip-text"
        >
          Settings
        </Link>
      </div>
      <div className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text pt-[20px]">
        Sign out
      </div>
    </nav>
  );
}

export default Navbar;
