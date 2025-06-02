import Navbardrive from "../drive_components/Navbardrive";
import Drive1stpageleft from "../drive_components/drive1stpageleft";
import img3 from "../drive_photos/img3.svg";
import img4 from "../drive_photos/img4.svg";
import Drive2ndpageleft from "../drive_components/drive2ndpageleft";
import Drive2ndpageright from "../drive_components/drive2ndpageright";
import Drive3rdpage from "../drive_components/drive3rdpage";
import Drive4thpage from "../drive_components/drive4thpage";
import Footer from "../components/Footer";

function Drive() {
  return (
    <div className="h-full flex flex-col ">
      <div className="flex flex-row">
        <Navbardrive />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto  min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <Drive1stpageleft />
        </div>
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="col-span-12 row-span-1 p-[10px] text-center text-[30px] font-semibold flex justify-center items-center">
            Why become a rideshare driver?
          </div>

          <div className="col-span-6 row-start-2 row-span-11">
            <Drive2ndpageleft />
          </div>

          <div className="col-span-6 row-start-2 row-span-11">
            <Drive2ndpageright />
          </div>
        </div>
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <h1 className=" col-span-12 row-span-1 text-3xl font-semibold text-center">
            Here's what you need to become a driver
          </h1>

          <img
            src={img3}
            alt="img3"
            className="col-span-12  row-span-7 w-full h-full object-cover"
          />

          <div className="col-span-12 row-span-5 w-full h-full ">
            <Drive3rdpage />
          </div>
        </div>
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <h1 className=" col-span-12 row-span-1 text-3xl font-semibold text-center">
            Safty on the road
          </h1>

          <img
            src={img4}
            alt="img4"
            className="col-span-12  row-span-7 w-full h-full object-cover"
          />

          <div className="col-span-12 row-span-5 w-full h-full ">
            <Drive4thpage />
          </div>
        </div>
        <div className=" h-[180px] shrink-0 snap-start">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Drive;
