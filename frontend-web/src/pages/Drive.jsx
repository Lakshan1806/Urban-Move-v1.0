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
    <div className="flex h-full flex-col">
      <div className="flex">
        <Navbardrive />
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12">
          <Drive1stpageleft />
        </div>
        <div className="hidden h-full shrink-0 snap-start grid-cols-12 grid-rows-12 lg:grid">
          <div className="col-span-12 flex items-center justify-center px-4 py-2 text-center text-xl font-semibold sm:text-2xl md:text-3xl lg:text-[30px]">
            Why become a rideshare driver?
          </div>
          <div className="col-span-12 h-dvh lg:col-span-6">
            <Drive2ndpageleft />
          </div>
          <div className="col-span-12 h-dvh lg:col-span-6">
            <Drive2ndpageright />
          </div>
        </div>

        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 lg:hidden">
          <div className="col-span-12 flex items-center justify-center px-4 py-2 text-center text-xl font-semibold sm:text-2xl md:text-3xl">
            Why become a rideshare driver?
          </div>
          <div className="col-span-12 h-full">
            <Drive2ndpageleft />
          </div>
        </div>

        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 lg:hidden">
          <div className="col-span-12 h-full">
            <Drive2ndpageright />
          </div>
        </div>

        <div className="hidden h-screen shrink-0 snap-start grid-cols-12 grid-rows-12 lg:grid lg:h-full">
          <h1 className="col-span-12 row-span-1 text-center text-3xl font-semibold">
            Here's what you need to become a driver
          </h1>

          <img
            src={img3}
            alt="img3"
            className="col-span-12 row-span-7 h-full w-full object-cover"
          />

          <div className="col-span-12 row-span-5 h-full w-full">
            <Drive3rdpage />
          </div>
        </div>

        <div className="flex h-full shrink-0 snap-start flex-col lg:hidden">
          <h1 className="bg-white px-4 py-4 text-center text-2xl font-semibold md:text-3xl">
            Here's what you need to become a driver
          </h1>
          <div className="flex-1">
            <img
              src={img3}
              alt="img3"
              className="h-full w-full object-center"
            />
          </div>
        </div>

        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 lg:hidden">
          <div className="col-span-12 row-span-12 h-full w-full">
            <Drive3rdpage />
          </div>
        </div>

        <div className="hidden h-screen shrink-0 snap-start grid-cols-12 grid-rows-12 lg:grid lg:h-full">
          <h1 className="col-span-12 row-span-1 text-center text-3xl font-semibold">
            Safty on the road
          </h1>

          <img
            src={img4}
            alt="img4"
            className="col-span-12 row-span-7 h-full w-full object-cover"
          />

          <div className="col-span-12 row-span-5 h-full w-full">
            <Drive4thpage />
          </div>
        </div>

        <div className="flex h-full shrink-0 snap-start flex-col lg:hidden">
          <h1 className="bg-white px-4 py-4 text-center text-2xl font-semibold md:text-3xl">
            Safty on the road
          </h1>

          <img
            src={img4}
            alt="img4"
            className="col-span-12 row-span-7 h-full w-full object-cover"
          />
        </div>

        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 lg:hidden">
          <div className="col-span-12 row-span-12 h-full w-full">
            <Drive4thpage />
          </div>
        </div>
        <div className="h-[180px] shrink-0 snap-start">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Drive;
