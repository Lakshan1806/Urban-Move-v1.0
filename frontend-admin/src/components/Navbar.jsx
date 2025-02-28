import { Link } from "react-router-dom";
import Logo from "../assets/Urban_Move_Colour.svg";
import HomeIcon from "../assets/Home.svg";
import RideIcon from "../assets/Ride.svg";
import RentalIcon from "../assets/Rental.svg";
import CustomerIcon from "../assets/Customer.svg";
import DriverIcon from "../assets/Driver.svg";
import FinancialIcon from "../assets/Financial.svg";
import MessageIcon from "../assets/Message.svg";
import AccountIcon from "../assets/Account.svg";
import SettingIcon from "../assets/Setting.svg";

function Navbar() {
  console.log("Navbar is rendering");

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/rides", label: "Rides", icon: RideIcon },
    { path: "/rentals", label: "Rentals", icon: RentalIcon },
    { path: "/customers", label: "Customers", icon: CustomerIcon },
    { path: "/drivers", label: "Drivers", icon: DriverIcon },
    { path: "/financials", label: "Financials", icon: FinancialIcon },
    { path: "/messages", label: "Messages", icon: MessageIcon },
    { path: "/account", label: "Account", icon: AccountIcon },
    { path: "/settings", label: "Settings", icon: SettingIcon },
  ];
  const linkstyles =
    "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text flex gap-[10px]";

  return (
    <nav className="bg-black h-svh flex flex-col items-center py-5 justify-between top-0 bottom-0 sticky">
      <header>
        <img src={Logo} alt="Logo" className="w-[148px] h-[139px]" />
      </header>

      <div className="flex flex-col min-h-[500px] justify-between ">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className={linkstyles}>
            <img src={item.icon} alt={item.label} />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text pt-[20px]">
        Sign out
      </div>
    </nav>
  );
}

export default Navbar;
