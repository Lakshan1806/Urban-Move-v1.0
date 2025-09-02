import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DriverAuthContext } from "../context/DriverAuthContext-driver";
import Logo from "../assets/Urban_Move_Colour.svg";
import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa";

function NavBar() {
  const { isAuthenticated, logout, driver } = useContext(DriverAuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "Navbar detected authentication change:",
      isAuthenticated,
      driver,
    );
  }, [isAuthenticated, driver]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/earnings", label: "Earnings" },
    { path: "/banking", label: "Banking" },
    { path: "/help", label: "Help" },
  ];

  const accountOptions = [
    { path: "/profile", label: "My Profile", icon: <FaUser /> },
    { label: "Activities", icon: <FaBell /> },
    { label: "Notifications", icon: <FaBell /> },
    {
      label: "Sign Out",
      icon: <FaSignOutAlt />,
      action: () => {
        logout();
        window.location.href = "http://localhost:5173/signin";
        setDropdownOpen(false);
      },
    },
  ];

  const linkstyles1 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase";

  return (
    <nav className="sticky top-0 flex h-[80px] w-full flex-row items-center justify-between bg-black px-[40px]">
      <header>
        <img src={Logo} alt="Logo" className="h-[60px] w-[60px]" />
      </header>
      <div className="flex gap-[40px]">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className={linkstyles1}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex gap-[10px]">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 rounded-full border border-orange-400 px-4 py-2 text-orange-400 transition hover:bg-orange-400 hover:text-black"
          >
            <FaUser />
            <span>ACCOUNT</span>
            <span>{dropdownOpen ? "▲" : "▼"}</span>
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />

              <div className="absolute right-0 z-50 mt-2 space-y-2 rounded-xl border border-orange-400 bg-black p-3 text-orange-400 shadow-lg">
                {accountOptions.map((option) =>
                  option.path ? (
                    <Link
                      to={option.path}
                      key={option.path || option.label}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </Link>
                  ) : (
                    <div
                      key={option.label}
                      onClick={() => {
                        option.action();
                        setDropdownOpen(false);
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-800"
                    >
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
