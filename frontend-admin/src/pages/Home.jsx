import ActivePromotions from "../components/Home/ActivePromotions";
import CarTypes from "../components/Home/CarTypes";
import CompletedRideGraph from "../components/Home/CompletedRideGraph";
import ExpiredPromotions from "../components/Home/ExpiredPromotions";
import YearlyIncome from "../components/Home/YearlyIncome";
import AddPromotions from "../components/Home/AddPromotions";

function Home() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Home"
        >
          Home
        </h1>
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
          <YearlyIncome />
          <ActivePromotions />
          <CarTypes />
          <AddPromotions />
          <ExpiredPromotions />
          <CompletedRideGraph />
        </div>
      </div>
    </div>
  );
}

export default Home;
