import CompletedRideStats from "./CompletedRideStats";

function CompletedRide() {
  return (
    <div className="col-span-3 row-span-3 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div>
        <CompletedRideStats/>
      </div>
    </div>
  );
}

export default CompletedRide;
