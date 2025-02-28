//import { useState } from "react";
import Navbardrive from "../drive_components/Navbardrive";
import Drive1stpageleft from "../drive_components/drive1stpageleft";
import img1 from "../drive_photos/img1.svg";
import Drive2ndpageleft from "../drive_components/drive2ndpageleft";
import Drive2ndpageright from "../drive_components/drive2ndpageright";

function Drive() {
  return (
    <div>
      <Navbardrive />

      <div className="flex h-auto px-[25px] py-0  justify-between items-center shrink-[0] self-stretch">
        <div >
          <Drive1stpageleft />
        </div>
        <div>
          <img src={img1} alt="img1" className="w-[1500px] h-[600px]" />
        </div>

      </div>
      <div>
        <div className="p-[10px] text-center text-[36px] font-[700] font-sans">
          Why become a rideshare driver?
        </div>
        <div className="grid grid-cols-2 gap-40 fontsans items-center" >
          <div>
            <Drive2ndpageleft />
          </div>
          <div>
            <Drive2ndpageright />
          </div>

        </div>

      </div>


    </div>

  )
}

export default Drive;