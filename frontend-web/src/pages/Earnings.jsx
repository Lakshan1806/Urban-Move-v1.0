import earnings_pic1 from "../assets/Earnings-pics/earnings-pic1.svg";

function Earnings() {
  return (
    <div className="">
      <div className="bg-white px-8 ">
        <div className="flex justify-between py-4">
          <p className="text-black font-bold text-lg">DRIVE</p>
          <p className="text-yellow-600 font-medium cursor-pointer text-lg">
            Go back
          </p>
        </div>

        <div className=" flex-col lg:flex-row justify-between pt-10 lg:pt-20 gap-6 flex items-center">
          <div className="lg:w-1/4 text-left">
            <h1 className="text-[48px] font-bold mb-4 ">
              Your earnings, explained
            </h1>
            <p className="text-black text-[24px] leading-relaxed font-bold">
              There are multiple ways to earn with Urban Move. Scroll down to
              learn how your earnings are calculated and the factors that
              influence how much you can make.
            </p>
          </div>

          <div className="lg:w-3/4">
            <img
              src={earnings_pic1}
              alt="Earnings"
              className="w-[1150px] h-[600px] max-w-[1100px] rounded-[25px] "
            />
          </div>
        </div>
      </div>
      <div className=" mx-auto p-6">
        <h1 class="text-[36px] font-bold text-center mb-7">
          How much can you make with Urban Move?
        </h1>
        <p className="text-center mb-6 text-[32px]">
          Your earnings with the Driver app depend on where, when, and how often
          you choose to drive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className=" p-4 rounded-lg">
            <h2 className="text-[32px] font-semibold">Where you drive</h2>
            <ul className="list-disc pl-4 mt-2 text-[24px]">
              <li>
                When demand for rides increases in certain areas, you can earn
                more with our Demand Bonus.
              </li>
              <li>
                The Driver app highlights these high-demand zones, so you can
                plan your trips strategically and maximize your earnings.
              </li>
            </ul>
          </div>

          <div className=" p-4 rounded-lg">
            <h2 className="text-[32px] font-semibold">When you're driving</h2>
            <ul className="list-disc pl-4 mt-2 text-[24px]">
              <li>
                Choosing the best days and times to go online can make a
                significant difference, and it varies by city.
              </li>
              <li>
                For example, consider going online during commute times for more
                ride requests.
              </li>
            </ul>
          </div>
        </div>

        <div className=" p-4 rounded-lg mt-6 text-center">
          <h2 className="text-[32px] font-semibold">How much time</h2>
          <p className="mt-2 text-[24px]">
            The amount of time you spend online is entirely up to you.
          </p>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-[32px] font-semibold">
            How are earnings calculated?
          </h2>
          <p className="text-[24px]">
            Your payouts are influenced by three key factors: trip fares,
            promotions that provide extra cash, and tips from the riders you
            pick up.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
//import Earnings from "./pages/Earnings.jsx";
// {/*<Earnings/>*/ } 