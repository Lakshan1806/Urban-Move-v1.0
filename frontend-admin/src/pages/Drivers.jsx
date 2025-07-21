import { useState } from "react";
import DriverDetail from "../components/Drivers/DriverDetail";
import DriverDetailList from "../components/Drivers/DriverDetailList";

function Drivers() {
  const [driver, setDriver] = useState(null);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Drivers"
        >
          Drivers
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          <DriverDetailList onSelect={setDriver} />
          <DriverDetail driver={driver} onUpdate={setDriver} />
        </div>
      </div>
    </div>
  );
}

export default Drivers;
