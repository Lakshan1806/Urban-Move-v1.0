import earnings_pic1 from "../assets/Earnings-pics/earnings-pic1.svg";
import earnings_pic2 from "../assets/Earnings-pics/earnings-pic2.svg";
import earnings_pic3 from "../assets/Earnings-pics/earnings-pic3.svg";
import earnings_pic4 from "../assets/Earnings-pics/earnings-pic4.svg";
import earnings_pic5 from "../assets/Earnings-pics/earnings-pic5.svg";

function Earnings() {
  return (
    <div className="">
      <div className="bg-white px-8">
        <div className="flex justify-between py-4">
          <p className="text-lg font-bold text-black">EARNINGS</p>
          <p className="cursor-pointer text-lg font-medium text-yellow-600">
            Go back
          </p>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-10 lg:flex-row lg:pt-20">
          <div className="ml-[60px] text-justify lg:w-2/7">
            <h1 className="mb-4 text-[48px] font-bold">
              Your earnings, explained
            </h1>
            <p className="text-[24px] leading-relaxed font-bold text-black">
              There are multiple ways to earn with Urban Move. Scroll down to
              learn how your earnings are calculated and the factors that
              influence how much you can make.
            </p>
          </div>

          <div className="lg:w-5/7">
            <img
              src={earnings_pic1}
              alt="Earnings"
              className="h-[600px] w-[1150px] max-w-[1100px] rounded-[25px]"
            />
          </div>
        </div>
      </div>
      <div className="pt-[156px]">
        <h1 class="mb-7 text-center text-[36px] font-[700]">
          How much can you make with Urban Move?
        </h1>
        <p className="mb-6 text-center text-[32px] font-[400]">
          Your earnings with the Driver app depend on where, when, and how often
          you choose to drive.
        </p>

        <div className="grid gap-[248px] p-[99px] md:grid-cols-2">
          <div className="rounded-lg p-4">
            <h2 className="pl-[120px] text-[32px] font-[700]">
              Where you drive
            </h2>
            <ul className="mt-2 list-disc pl-4 text-justify text-[24px] font-[400]">
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

          <div className="rounded-lg p-4">
            <h2 className="pl-[110px] text-[32px] font-[700]">
              When you're driving
            </h2>
            <ul className="mt-2 list-disc pl-4 text-justify text-[24px] font-[400]">
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

        <div className="mt-6 rounded-lg pt-[10px] text-center">
          <h2 className="text-[32px] font-[700]">How much time</h2>
          <p className="mt-2 text-[24px] font-[400]">
            The amount of time you spend online is entirely up to you.
          </p>
        </div>

        <div className="mt-6 text-center">
          <h2 className="pt-[80px] text-[32px] font-[700]">
            How are earnings calculated?
          </h2>
          <p className="text-[24px] font-[400]">
            Your payouts are influenced by three key factors: trip fares,
            promotions that provide extra cash, and tips from the riders you
            pick up.
          </p>
        </div>
        <div className=" ">
          <h2 className="ml-[60px] pt-[80px] text-[32px] font-[700]">
            It all starts with fares
          </h2>
          <p className="mt-[35px] text-center text-[24px] font-[400]">
            Fares are the amount you earn for completing a ride, and they vary
            depending on the time, region, or city.
          </p>
        </div>
      </div>

      <div className="grid gap-[96px] p-[99px] md:grid-cols-2">
        <div>
          <div className="rounded-lg p-4">
            <div className="center-container">
              <img
                src={earnings_pic2}
                alt="Earnings"
                className="h-[285px] w-[440px]"
              />
            </div>
            <h2 className="text-center text-[32px] font-[700]">
              Per-minute and per-mile
            </h2>
            <ul className="mt-2 list-disc pl-4 text-justify text-[24px] font-[400]">
              <li>
                In some cities, you'll earn a base fare, plus additional money
                for the time and distance you travel (these rates vary by city).
              </li>
              <li>
                Your earnings will be determined at the end of every trip, based
                on how long and how far you travel.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg p-4">
          <div className="center-container items-center">
            <img
              src={earnings_pic3}
              alt="Earnings"
              className="h-[285px] w-[440px]"
            />
          </div>
          <h2 className="text-center text-[32px] font-[700]">Upfront Fares</h2>
          <ul className="mt-2 list-disc pl-4 text-justify text-[24px] font-[400]">
            <li>
              In some cities, you can see how much you'll make and where you'll
              go before you accept a trip.
            </li>
            <li>
              Upfront Fares are calculated based on current driving conditions,
              like destination and demand.
            </li>
            <li>
              If there's unexpected traffic and the trip gets a lot longer, your
              fare will increase.
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto p-[156px]">
        <h1 class="mb-7 text-center text-[36px] font-[700]">
          More factors that impact fares{" "}
        </h1>
        <p className="mb-6 text-center text-[32px] font-[400]">
          Regardless of your city or region, a few additional factors will
          determine how much you'll earn for each ride.
        </p>

        <div className="mt-6 rounded-lg p-4 text-center">
          <h2 className="text-[32px] font-[700]">Reservations</h2>
          <p className="mt-2 text-[24px] font-[400]">
            Make extra money by accepting rides that passengers book in
            advance.{" "}
          </p>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-[32px] font-[700]">Cancellations </h2>
          <p className="text-[24px] font-[400]">
            If a rider cancels after you've begun driving toward them, a
            cancellation fee is charged to the rider, and you're compensated for
            the inconvenience.
          </p>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-[32px] font-[700]">Tolls</h2>
          <p className="text-[24px] font-[400]">
            When your vehicle incurs a qualifying toll or surcharge during a
            trip, the toll amount is added to the rider's fare and reimbursed to
            you.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="ml-[60px] text-[32px] font-[700]">
          Next, add in promotions
        </h2>
        <p className="ml-[90px] text-[24px] font-[400]">
          Promotions are a simple way to boost your earnings. Check the Driver
          app to stay updated on the latest promotions available to you.
        </p>
        <div className="mt-[40px] ml-[180px] flex items-center justify-center gap-[380px]">
          <div className="pr-30 lg:w-1/2">
            <img
              src={earnings_pic4}
              alt="Earnings"
              className="h-[550px] w-[420px]"
            />
          </div>
          <div className="pr-30 lg:w-1/2">
            <img
              src={earnings_pic5}
              alt="Earnings"
              className="h-[550px] w-[420px]"
            />
          </div>
        </div>
      </div>
      <div className="grid gap-6 p-[99px] md:grid-cols-2">
        <div className="rounded-lg p-4">
          <h2 className="text-center text-[32px] font-[700]">Demand Bonus</h2>
          <ul className="mt-2 list-disc pl-4 text-justify text-[24px] font-[400]">
            <li>When demand increases, earnings for rides go up.</li>
            <li>
              Look out for Demand Bonus zones in the Driver app to boost your
              income during peak times.
            </li>
          </ul>
        </div>

        <div className="rounded-lg p-4">
          <h2 className="text-center text-[32px] font-[700]">Quests</h2>
          <ul className="mt-2 list-disc pl-4 text-[24px] font-[400]">
            <li>
              Earn extra by completing a set number of trips within a specified
              time.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Earnings;
