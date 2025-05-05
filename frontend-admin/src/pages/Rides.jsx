import AddPromotions from "../components/Rides/AddPromotions";
import CompletedRide from "../components/Rides/CompletedRide";
import CancelledRide from "../components/Rides/CancelledRide";
import RideTable from "../components/Rides/RideTable";

function Rides() {
  return (
    <div className="h-full flex flex-col">
      <div>
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
          Rides
        </h1>
      </div>
      <div className="grid gap-3 grid-cols-12 grid-rows-12 flex-1 min-h-0 overflow-auto">
        <CompletedRide />
        <CancelledRide />
        <RideTable />
        <AddPromotions />
        <RideTable />
        <RideTable />
      </div>
    </div>
  );
}

export default Rides;
