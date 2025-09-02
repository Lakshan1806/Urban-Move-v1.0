import { Link, useNavigate } from "react-router-dom";
import img1 from "../drive_photos/img1.svg";

function Drive1stpageleft() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dregister");
  };
  return (
    <div className="col-span-12 row-span-12 items-center justify-center">
      <div className="flex h-full min-h-0 w-full flex-col px-4 lg:flex-row lg:px-20">
        <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-4 lg:w-1/2 lg:px-25">
          <p className="text-center text-[40px] leading-10 font-semibold lg:text-left">
            Drive on your schedule and earn what you deserve.
          </p>

          <Link
            to="/dLogin"
            className="p-4 text-[15px] leading-6 font-semibold text-black"
          >
            Already have an account? Sign in
          </Link>
          <div className="button-wrapper">
            <button onClick={handleClick} className="button-primary">
              Get Started
            </button>
          </div>
        </div>
        <div className="mt-4 flex h-full w-full items-center justify-center lg:mt-0 lg:w-1/2">
          <img
            src={img1}
            alt="img1"
            className="h-auto max-h-[300px] object-contain lg:h-full lg:max-h-none"
          />
        </div>
      </div>
    </div>
  );
}

export default Drive1stpageleft;
