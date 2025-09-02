import CompletedRideGraph from "../components/Home/CompletedRideGraph";
import CancelledRideGraph from "../components/Rides/CancelledRideGraph";
import CompletedRides from "../components/Rides/CompletedRides";
import CurrentRides from "../components/Rides/CurrentRides";
import CancelledRides from "../components/Rides/CancelledRides";

function Rides() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Rides"
        >
          Rides
        </h1>
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
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
