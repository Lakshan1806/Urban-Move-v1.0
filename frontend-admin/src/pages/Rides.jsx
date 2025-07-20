import CompletedRideGraph from "../components/Home/CompletedRideGraph";
import CancelledRideGraph from "../components/Rides/CancelledRideGraph";
import CompletedRides from "../components/Rides/CompletedRides";
import CurrentRides from "../components/Rides/CurrentRides";
import CancelledRides from "../components/Rides/CancelledRides";

function Rides() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Rides"
        >
          Rides
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          <CompletedRideGraph />
          <CancelledRideGraph />
          <CompletedRides />
          <CurrentRides />
          <CancelledRides />
        </div>
      </div>
    </div>
  );
}

export default Rides;
