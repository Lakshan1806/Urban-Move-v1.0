import { Link, useNavigate } from "react-router-dom";
import img1 from "../drive_photos/img1.svg";

function Drive1stpageleft() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dregister");
  };
  return (
    <div className="justify-center items-center col-span-12 row-span-12">
      <div className="flex h-full w-full min-h-0 px-20">
        <div className="flex flex-col w-1/2 min-h-0 h-full items-center justify-center px-25">
          <p className="text-[40px] font-semibold leading-10 ">
            Drive on your schedule and earn what you deserve.
          </p>

          <Link
            to="/dLogin"
            className="text-black p-8 text-[15px] font-semibold leading-6"
          >
            Already have an account? Sign in
          </Link>
          <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center items-center px-[22px] py-[5px] text-[20px]">
            <button
              onClick={handleClick}
              className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className=" flex w-1/2 h-full justify-center">
          <img src={img1} alt="img1" className="h-full" />
        </div>
      </div>
    </div>
  );
}

export default Drive1stpageleft;
