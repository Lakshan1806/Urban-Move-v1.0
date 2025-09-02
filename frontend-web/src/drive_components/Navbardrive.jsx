import { Link } from "react-router-dom";

function Navbardrive() {
  const navItemsDrive = [{ path: "/drive", label: "Drive" }];
  const navItems = [
    { path: "/Overview", label: "Overview" },
    { path: "/Earnings", label: "Earnings" },
    { path: "/Contactus", label: "Contact Us" },
  ];

  return (
    <nav className="flex w-full flex-col items-center justify-between gap-4 px-5 py-3 lg:flex-row">
      <div className="flex items-center justify-center gap-4 text-[20px] font-semibold">
        {navItemsDrive.map((item) => (
          <Link to={item.path} key={item.path}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-[#f3c624] to-[#f77111] bg-clip-text font-sans text-lg text-transparent sm:flex-col lg:flex-row">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className="px-4 py-2">
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbardrive;
