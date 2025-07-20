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
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Rentals"
        >
          Rentals
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          {component}
          <CarDetails car={carDetails} onUpdate={setCarDetails} />
        </div>
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          <CurrentActivity />
          <BranchLocations/>
          <RecentlyDeletedCars />
          <RecentlyDeletedUnits />
        </div>
      </div>
    </div>
  );
}

export default Rentals;
