import { useState } from "react";
import AvailableCars from "../components/Rentals/AvailableCars";
import CarDetails from "../components/Rentals/CarDetails";
import AddCars from "../components/Rentals/AddCars";

function Rentals() {
  const [carDetails, setCarDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleButtonClick = () => {
    setEditMode(true);
  };
  let component = null;
  if (!editMode) {
    component = <AvailableCars onCarSelect={setCarDetails} />;
  } else {
    component = <AddCars onSaveForm={setEditMode}/>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between">
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Rentals
        </h1>
        <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer">
          <button
            type="button"
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
            onClick={handleButtonClick}
          >
            Add Cars
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 grid-rows-12 gap-3 h-svh">
        <div className="col-span-4 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
          {component}
        </div>
        <div className="col-span-8 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
          <CarDetails car={carDetails} />
        </div>
      </div>
    </div>
  );
}

export default Rentals;
