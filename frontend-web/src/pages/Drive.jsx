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
      <div className="flex ">
        <Navbardrive />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto  min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <Drive1stpageleft />
        </div>
        <div className="hidden lg:grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="col-span-12 px-4 py-2 text-center font-semibold flex justify-center items-center text-xl sm:text-2xl md:text-3xl lg:text-[30px]">
            Why become a rideshare driver?
          </div>
          <div className="col-span-12 lg:col-span-6 h-dvh">
            <Drive2ndpageleft />
          </div>
          <div className="col-span-12 lg:col-span-6 h-dvh">
            <Drive2ndpageright />
          </div>
        </div>

        {/* Second page - Mobile version (below lg) - Left section */}
        <div className="lg:hidden grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="col-span-12 px-4 py-2 text-center font-semibold flex justify-center items-center text-xl sm:text-2xl md:text-3xl">
            Why become a rideshare driver?
          </div>
          <div className="col-span-12 h-full">
            <Drive2ndpageleft />
          </div>
        </div>

        {/* Second page - Mobile version (below lg) - Right section */}
        <div className="lg:hidden grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="col-span-12 h-full">
            <Drive2ndpageright />
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-12 grid-rows-12 h-screen lg:h-full shrink-0 snap-start">
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
        {/* 3 rd page - Mobile version (below lg) - heading & image */}
        <div className="lg:hidden flex flex-col h-full shrink-0 snap-start">
          <h1 className="text-2xl md:text-3xl font-semibold text-center px-4 py-4 bg-white">
            Here's what you need to become a driver
          </h1>
          <div className="flex-1">
            <img
              src={img3}
              alt="img3"
              className=" w-full h-full object-center"
            />
          </div>
        </div>

        {/* Third page - Mobile version - Content section */}
        <div className="lg:hidden grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="col-span-12 row-span-12 w-full h-full ">
            <Drive3rdpage />
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-12 grid-rows-12 h-screen lg:h-full shrink-0 snap-start">
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

        {/* 4th page - Mobile version (below lg) - heading & image */}
        <div className="lg:hidden flex flex-col h-full shrink-0 snap-start">
          <h1 className="text-2xl md:text-3xl font-semibold text-center px-4 py-4 bg-white">
            Safty on the road
          </h1>

          <img
            src={img4}
            alt="img4"
            className="col-span-12  row-span-7 w-full h-full object-cover"
          />
        </div>

        {/* 4th page - Mobile version - Content section */}
        <div className="lg:hidden grid grid-cols-12 grid-rows-12 h-full shrink-0 snap-start">
          <div className="col-span-12 row-span-12 w-full h-full ">
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
