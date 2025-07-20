import { Link } from "react-router-dom";

function Navbardrive() {
  const navItemsDrive = [{ path: "/drive", label: "Drive" }];
  const navItems = [
    { path: "/Overview", label: "Overview" },
    { path: "/Earnings", label: "Earnings" },
    { path: "/Contactus", label: "Contact Us" },
  ];

  return (
    <nav className="flex flex-col lg:flex-row w-full px-5 py-3 justify-between items-center gap-4">
  <div className="flex justify-center items-center gap-4 text-[20px] font-semibold">
    {navItemsDrive.map((item) => (
      <Link to={item.path} key={item.path}>
        {item.label}
      </Link>
    ))}
  </div>

  <div className="flex flex-col sm:flex-col lg:flex-row items-center gap-4 text-lg font-sans bg-gradient-to-b from-[#f3c624] to-[#f77111] text-transparent bg-clip-text">
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
