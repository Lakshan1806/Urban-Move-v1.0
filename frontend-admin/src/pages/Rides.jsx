import AddPromotions from "../components/Rides/AddPromotions";
import CompletedRide from "../components/Rides/CompletedRide";
import CancelledRide from "../components/Rides/CancelledRide";
import RideTable from "../components/Rides/RideTable";

function Rides() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
          Rides
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          <CompletedRide />
          <CancelledRide />
          <RideTable />
          <AddPromotions />
          <RideTable />
          <RideTable />
        </div>
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          <CompletedRide />
          <CancelledRide />
          <RideTable />
          <AddPromotions />
          <RideTable />
          <RideTable />
        </div>
      </div>
    </div>
  );
}

export default Rides;
