import { Link, useNavigate } from "react-router-dom";
import Line from "../signup_photos/linervector.svg";
import arrow from "../signup_photos/arrowvector.svg";
import vector1 from "../signup_photos/vector1.svg";
import { FaArrowRight } from "react-icons/fa";

function Signininitialpage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login");
  };
  const handleClick = () => {
    navigate("/dlogin");
  };
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full px-4 lg:px-14 py-50 gap-10 ">
      <div className="flex flex-col items-center gap-4 text-center">
        <p
          className="text-grad-stroke font-[300] text-[36px]"
          data-text="Sign in to driver"
        >
          Sign in to driver
        </p>
        <img src={Line} />
        <div className="button-wrapper">
          <button
            onClick={handleClick}
            className="button-primary flex gap-2 justify-center items-center"
          >
            CONTINUE
            <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
          </button>
        </div>
        <p>
          <Link to="/register">Don't have an account? Sign up</Link>
        </p>
      </div>
      <img
        src={vector1}
        alt="divider"
        className="hidden lg:block h-full w-auto object-contain"
      />
      <hr className="block lg:hidden border-t border-gray-300 w-full my-4" />

      <div className="flex flex-col items-center gap-4 text-center">
        <p
          className="text-grad-stroke font-[300] text-[36px]"
          data-text="Sign in to ride / rent"
        >
          Sign in to ride / rent
        </p>
        <img src={Line} />
        <div className="button-wrapper">
          <button
            onClick={handleContinue}
            className="button-primary flex gap-2 justify-center items-center"
          >
            CONTINUE
            <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
          </button>
        </div>
        <p>
          <Link to="/register">Don't have an account? Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Signininitialpage;
