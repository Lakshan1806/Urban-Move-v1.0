import { Link, useNavigate } from "react-router-dom";
import img1 from "../drive_photos/img1.svg";

function Drive1stpageleft() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dregister");
  };
  return (
    <div className="justify-center items-center col-span-12 row-span-12">
      <div className="flex flex-col lg:flex-row h-full w-full min-h-0 px-4 lg:px-20">
        <div className="flex flex-col w-full lg:w-1/2 min-h-0 h-full items-center justify-center px-4 lg:px-25">
          <p className="text-[40px] font-semibold leading-10 text-center lg:text-left">
            Drive on your schedule and earn what you deserve.
          </p>

          <Link
            to="/dLogin"
            className="text-black p-4 text-[15px] font-semibold leading-6"
          >
            Already have an account? Sign in
          </Link>
          <div className="button-wrapper">
            <button onClick={handleClick} className="button-primary">
              Get Started
            </button>
          </div>
        </div>
        <div className="flex w-full lg:w-1/2 h-full justify-center items-center mt-4 lg:mt-0">
          <img src={img1} alt="img1" className="object-contain 
               max-h-[300px] lg:max-h-none 
               h-auto lg:h-full" /> 
        </div>
      </div>
    </div>
  );
}

export default Drive1stpageleft;
