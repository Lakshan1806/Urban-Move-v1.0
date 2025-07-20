import ActivePromotions from "../components/Home/ActivePromotions";
import CarTypes from "../components/Home/CarTypes";
import CompletedRideGraph from "../components/Home/CompletedRideGraph";
import ExpiredPromotions from "../components/Home/ExpiredPromotions";
import YearlyIncome from "../components/Home/YearlyIncome";
import AddPromotions from "../components/Home/AddPromotions";

function Home() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Home"
        >
          Home
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
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
