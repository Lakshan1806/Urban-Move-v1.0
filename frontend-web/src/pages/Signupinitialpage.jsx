import { Link, useNavigate } from "react-router-dom";
import Line from "../signup_photos/linervector.svg";
import vector1 from "../signup_photos/vector1.svg";
import { FaArrowRight } from "react-icons/fa";

function Signupinitialpage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/register");
  };
  const handleClick = () => {
    navigate("/dregister");
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-10 px-4 py-50 lg:flex-row lg:px-14">
      <div className="flex flex-col items-center gap-4 text-center">
        <p
          className="text-grad-stroke text-[36px] font-[300]"
          data-text="Create a driver account"
        >
          Create a driver account
        </p>
        <img src={Line} />
        <div className="button-wrapper">
          <button
            onClick={handleClick}
            className="button-primary flex items-center justify-center gap-2"
          >
            CONTINUE
            <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
          </button>
        </div>
        <p>
          <Link to="/login">Already have an account? Sign in</Link>
        </p>
      </div>

      <img
        src={vector1}
        alt="divider"
        className="hidden h-full w-auto object-contain lg:block"
      />

      <hr className="my-4 block w-full border-t border-gray-300 lg:hidden" />

      <div className="flex flex-col items-center gap-4 text-center">
        <p
          className="text-grad-stroke text-[36px] font-[300]"
          data-text="Create a customer account "
        >
          Create a customer account
        </p>

        <img src={Line} />
        <div className="button-wrapper">
          <button
            onClick={handleContinue}
            className="button-primary flex items-center justify-center gap-2"
          >
            CONTINUE
            <FaArrowRight className="[&>path]:fill-[url(#icon-gradient)]" />
          </button>
        </div>
        <p>
          <Link to="/login">Already have an account? Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signupinitialpage;
