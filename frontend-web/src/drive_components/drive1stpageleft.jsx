import { Link } from "react-router-dom";
import img1 from "../drive_photos/img1.svg";

function Drive1stpageleft() {
  return (
    <div className="justify-center items-center col-span-12 row-span-12">
      <div className="flex h-full w-full min-h-0">
        <div className="flex flex-col w-1/3 min-h-0 h-full">
          <p>
            Drive on your schedule <br />
            and earn what you <br />
            deserve.
          </p>

          <Link
            to="/dLogin"
            className="text-black p-4 text-[20px] font-[700] leading-6"
          >
            Already have an account? Sign in
          </Link>
        </div>
        <div className="w-2/3 h-full">
         {/*  <img src={img1} alt="img1" className="h-full w-auto max-w-full" /> */}
        </div>
      </div>
    </div>
  );
}

export default Drive1stpageleft;
