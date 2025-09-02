import { useState } from "react";
import AvailableCars from "../components/Rentals/AvailableCars";
import CarDetails from "../components/Rentals/CarDetails";
import AddCars from "../components/Rentals/AddCars";
import RecentlyDeletedCars from "../components/Rentals/RecentlyDeletedCars";
import RecentlyDeletedUnits from "../components/Rentals/RecentlyDeletedUnits";
import CurrentActivity from "../components/Rentals/CurrentActivity";
import BranchLocations from "../components/Rentals/BranchLocations";

function Rentals() {
  const [carDetails, setCarDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  let component = null;
  if (!editMode) {
    component = (
      <AvailableCars onCarSelect={setCarDetails} onAddCars={setEditMode} />
    );
  } else {
    component = <AddCars onSaveForm={setEditMode} />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Rentals"
        >
          Rentals
        </h1>
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
          {component}
          <CarDetails car={carDetails} onUpdate={setCarDetails} />
        </div>
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
          <CurrentActivity />
          <BranchLocations />
          <RecentlyDeletedCars />
          <RecentlyDeletedUnits />
        </div>
      </div>
    </div>
  );
}

export default Rentals;
