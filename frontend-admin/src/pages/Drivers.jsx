import { useState } from "react";
import DriverDetail from "../components/Drivers/DriverDetail";
import DriverDetailList from "../components/Drivers/DriverDetailList";

function Drivers() {
  const [driver, setDriver] = useState(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Drivers"
        >
          Drivers
        </h1>
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
          <DriverDetailList onSelect={setDriver} />
          <DriverDetail driver={driver} onUpdate={setDriver} />
        </div>
      </div>
    </div>
  );
}

export default Drivers;
