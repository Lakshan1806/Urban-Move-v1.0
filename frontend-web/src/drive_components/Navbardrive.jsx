import { Link } from "react-router-dom";

function Navbardrive() {
  const navItemsDrive = [{ path: "/drive", label: "Drive" }];
  const navItems = [
    { path: "/Overview", label: "Overview" },
    { path: "/Earnings", label: "Earnings" },
    { path: "/Contactus", label: "Contact Us" },
  ];

  const linkstyle = "flex p-[10px] justify-center items-center gap-[10px]";
  return (
    <nav className="flex w-full p-[0px 20px] justify-between items-center  top-[81px] ">
      <div className="flex p-[10px] justify-center items-center gap-[10px] text-center text-[20px] ">
        {navItemsDrive.map((item) => (
          <Link to={item.path} key={item.path} className="font-semibold">
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-[39px] font-sans bg-gradient-to-b from-[#f3c624] to-[#f77111] text-transparent bg-clip-text">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path} className={linkstyle}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbardrive;
