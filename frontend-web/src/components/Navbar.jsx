import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Urban_Move_Colour.svg";
import { FaUser, FaBell, FaSignOutAlt, FaBars } from "react-icons/fa";

function NavBar() {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "Navbar detected authentication change:",
      isAuthenticated,
      user,
    );
  }, [isAuthenticated, user]);

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

  const accountOptions = [
    { path: "/profile", label: "My Profile", icon: <FaUser /> },
    { path: "/history", label: "Activities", icon: <FaBell /> },
    {
      label: "Sign Out",
      icon: <FaSignOutAlt />,
      action: () => {
        logout();
        navigate("/");
        setDropdownOpen(false);
      },
    },
  ];

  const linkstyles1 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase";

  const linkstyles2 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase rounded-[50px]";

  return (
    <>
      <nav className="sticky top-0 z-20 flex h-full w-full flex-row items-center justify-between bg-black px-[25px]">
        <div className="flex w-full items-center justify-between lg:w-auto">
          <div className="relative flex flex-1 justify-center lg:justify-start">
            <img src={Logo} alt="Logo" className="h-[60px] w-[60px]" />
          </div>
          <div className="absolute right-0 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-2xl text-orange-400"
            >
              <FaBars />
            </button>
          </div>
        </div>
        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path} className={linkstyles1}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden gap-[10px] lg:flex">
          {!isAuthenticated ? (
            accAuth.map((item) => (
              <Link to={item.path} key={item.path} className={linkstyles2}>
                {item.label}
              </Link>
            ))
          ) : (
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
          )}
        </div>
      </nav>
      {mobileOpen && (
        <div className="relative z-30 flex flex-col justify-center gap-4 bg-black px-5 py-3 text-orange-400 lg:hidden">
          {navItems.map((item) => (
            <div key={item.path} className="flex justify-center">
              <Link
                to={item.path}
                key={item.path}
                className="border-b border-orange-400 pb-2 text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </div>
          ))}

          {!isAuthenticated ? (
            accAuth.map((item) => (
              <div key={item.path} className="flex justify-center">
                <Link
                  to={item.path}
                  key={item.path}
                  className="border-b border-orange-400 pb-2 text-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </div>
            ))
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex w-full items-center justify-center space-x-2 rounded-full border border-orange-400 px-4 py-2 text-orange-400 transition hover:bg-orange-400 hover:text-black"
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
                  <div className="relative z-50 mt-2 space-y-2 rounded-xl border border-orange-400 bg-black p-3 text-orange-400 shadow-lg">
                    {accountOptions.map((option) =>
                      option.path ? (
                        <Link
                          to={option.path}
                          key={option.path}
                          className="flex items-center gap-2 border-b border-orange-400 pb-2 text-lg"
                          onClick={() => {
                            setMobileOpen(false);
                            setDropdownOpen(false);
                          }}
                        >
                          {option.icon}
                          {option.label}
                        </Link>
                      ) : (
                        <div
                          key={option.label}
                          className="flex cursor-pointer items-center gap-2 border-b border-orange-400 pb-2 text-lg"
                          onClick={() => {
                            option.action();
                            setMobileOpen(false);
                            setDropdownOpen(false);
                          }}
                        >
                          {option.icon}
                          {option.label}
                        </div>
                      ),
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default NavBar;
