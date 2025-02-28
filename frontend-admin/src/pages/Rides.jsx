import AddPromotions from "../components/Rides/AddPromotions";
import RideStats from "../components/Rides/RideStats";
import RideTable from "../components/Rides/RideTable";

function Rides() {
  return (
    <div>
      <div>
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Rides
        </h1>
      </div>
      <div className="grid gap-3 grid-cols-12 grid-rows-12 h-svh">
        <RideStats/>
        <RideStats/>
        <RideTable/>
        <AddPromotions/>
        <RideTable/>
        <RideTable/>
        
      </div>
    </div>
  );
}

export default Rides;
