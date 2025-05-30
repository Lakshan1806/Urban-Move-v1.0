import Logo from "../assets/Urban_Move_Colour.svg";

function Footer() {
  const linkstyles1 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[15px] uppercase";

  const linkstyles2 =
    "font-sans bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text text-[12px]  rounded-[50px]";

  return (
    <nav className="bg-black w-full px-[25px]  h-[180px] py-4 flex flex-col items-center justify-between shrink-0">
      <div className="flex flex-row justify-between w-full h-2/3">
        <div>
          <img src={Logo} alt="Logo" className="h-full" />
        </div>
        <div>
          <p className={linkstyles1}>Contact us</p>
          <p className={linkstyles2}>Contact us</p>
        </div>
        <div>
          <p className={linkstyles1}>Company</p>
        </div>
        <div>
          <p className={linkstyles1}>Products</p>
        </div>
        <div>
          <p className={linkstyles1}>Follow Us</p>
        </div>
      </div>
      <div className="h-1/3"></div>
    </nav>
  );
}

export default Footer;
