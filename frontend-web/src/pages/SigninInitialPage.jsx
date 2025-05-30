import { Link, useNavigate } from "react-router-dom";
import Line from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import vector1 from "../signup_photos/vector1.svg";

function Signininitialpage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login");
  };
  const handleClick = () => {
    navigate("/dlogin");
  };
  return (
    <div className="flex justify-between h-full px-14">
      <div className="flex flex-col items-center justify-center  gap-[20px]">
        <p className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Sign in to driver
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
          <Link to="/register">Don't have an account? Sign up</Link>
        </p>
      </div>

      <img src={vector1} className="h-full py-10" />

      <div className="flex flex-col items-center justify-center  gap-[20px]">
        <p className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Sign in to ride / rent
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
          <Link to="/register">Don't have an account? Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Signininitialpage;
