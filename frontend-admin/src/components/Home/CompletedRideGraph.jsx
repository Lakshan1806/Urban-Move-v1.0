import CompletedRideData from "./CompletedRideData";

function CompletedRideGraph() {
  return (
    <div className="col-span-4 row-span-4 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="h-full">
        <CompletedRideData/>
      </div>
    </div>
  );
}

export default CompletedRideGraph;
