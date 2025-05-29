//import { useState } from "react";
import Navbardrive from "../drive_components/Navbardrive";
import Drive1stpageleft from "../drive_components/drive1stpageleft";
import img3 from "../drive_photos/img3.svg";
import img4 from "../drive_photos/img4.svg";
import Drive2ndpageleft from "../drive_components/drive2ndpageleft";
import Drive2ndpageright from "../drive_components/drive2ndpageright";
import Drive3rdpage from "../drive_components/drive3rdpage";
import Drive4thpage from "../drive_components/drive4thpage";

function Drive() {
  return (
    <div className="h-full flex flex-col ">
      {/* <div className="flex flex-row">
        <Navbardrive />
      </div> */}
      <div className="flex-1 flex flex-col overflow-y-auto  min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <Drive1stpageleft />
        </div>
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          {/* <div className="p-[10px] text-center text-[36px] font-[700] font-sans">
            Why become a rideshare driver?
          </div> */}
          <Drive2ndpageleft />
          <Drive2ndpageright />
        </div>
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          {/* <p className=" text-center text-[36px] font-[700]">
              Here's what you need to become a driver
            </p> */}
          {/* <img src={img3} alt="img3" /> */}

          <Drive3rdpage />
        </div>
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          {/* <p className=" text-center text-[36px] font-[700]">
              Here's what you need to become a driver
            </p> */}
          {/* <img src={img3} alt="img3" /> */}

          <Drive3rdpage />
        </div>
       
      </div>
    </div>
  );
}

export default Drive;
