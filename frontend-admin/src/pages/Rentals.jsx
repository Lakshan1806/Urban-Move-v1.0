import { useState } from "react";
import AvailableCars from "../components/Rentals/AvailableCars";
import CarDetails from "../components/Rentals/CarDetails";
import AddCars from "../components/Rentals/AddCars";
//import CurrentActivity from "../components/Rentals/CurrentActivity";

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
      <div className="flex  justify-between flex-none">
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Rentals
        </h1>
      </div>
      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto">
        <div className="flex h-full flex-none gap-3">
          <div className="w-1/3  p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto shrink-0">
            {component}
          </div>
          <div className="flex-1 shrink-0   p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
            <CarDetails car={carDetails} onUpdate={setCarDetails} />
          </div>
        </div>
        <div className="flex h-full flex-none gap-3">
          <div className="w-2/3 shrink-0   p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
            <div>Rental History</div>
          </div>
          <div className="flex flex-col h-full flex-1  gap-3 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
            <div className=" h-1/2 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto shrink-0">
              <div>Recently Deleted Cars</div>
            </div>
            <div className=" h-1/2 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto shrink-0">
              <div>Recently Deleted Units</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rentals;
