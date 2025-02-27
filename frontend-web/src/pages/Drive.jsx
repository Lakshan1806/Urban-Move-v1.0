/*import { useState } from "react";
import { Link } from "react-router-dom";

import img2L from "../drive_photos/img2L.svg";
import img2R from "../drive_photos/img2R.svg";
import img3 from "../drive_photos/img3.svg";
import img4 from "../drive_photos/img4.svg";*/
import Navbardrive from "../drive_components/Navbardrive";
import Drive1stpageleft from "../drive_components/drive1stpageleft";
import img1 from "../drive_photos/img1.svg";

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


    </div>

  )
}

export default Drive;