import { Link, useNavigate } from "react-router-dom";
import Line from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import vector1 from "../signup_photos/vector1.svg";

function Signupinitialpage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/register");
  };
  const handleClick = () => {
    navigate("/dregister");
  };
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full px-4 lg:px-14 py-50 gap-10 ">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Create a driver account
        </p>
        <img src={Line} />
        <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center px-[22px] py-[10px] text-[20px]">
          <button
            onClick={handleClick}
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
          >
            continue
          </button>
          <img src={arrow} className="pl-1 pt-1" />
        </div>
        <p>
          <Link to="/login">Already have an account? Sign in</Link>
        </p>
      </div>

      <img
        src={vector1}
        alt="divider"
        className="hidden lg:block h-full w-auto object-contain"
      />

      <hr className="block lg:hidden border-t border-gray-300 w-full my-4" />

      <div className="flex flex-col items-center gap-4 text-center">
        <p className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Create a customer account
        </p>

        <img src={Line} />
        <div className="bg-black rounded-[50px] max-w-[160px] flex justify-center px-[22px] py-[10px] text-[20px]">
          <button
            onClick={handleContinue}
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
          >
            continue
          </button>
          <img src={arrow} className="pl-1 pt-1" />
        </div>
        <p>
          <Link to="/login">Already have an account? Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signupinitialpage;
