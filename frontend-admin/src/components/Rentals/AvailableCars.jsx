import axios from "axios";
import { useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";

function AvailableCars({ onCarSelect, onAddCars }) {
  const [car, setCar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_car_models");
        console.log("res :", response);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = () => {
    onAddCars(true);
  };

  return (
    <div className="col-span-4 row-span-12 flex flex-col gap-4 overflow-auto rounded-3xl pb-0 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="sticky top-0 z-20 w-full bg-white/30 px-4 py-5 backdrop-blur-md">
        <div className="button-wrapper">
          <button
            type="button"
            className="button-primary flex flex-row items-center justify-center gap-2"
            onClick={handleButtonClick}
          >
            <GoPlusCircle className="[&>path]:fill-[url(#icon-gradient)]" />
            Add Cars
          </button>
        </div>
      </div>

      {car.map((cars) => {
        console.log("data :", cars);
        console.log("data :", cars.images);
        return (
          <div
            key={cars._id}
            className="mx-4 flex flex-row gap-4 rounded-3xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
          >
            <img
              src={cars.keyImage}
              alt="car image"
              className="h-full w-1/2 rounded-lg object-cover"
            />
            <div className="flex w-1/2 flex-col gap-1">
              <h3 className="text-sm font-bold">{cars.make}</h3>
              <h3 className="text-xl font-bold">{cars.model}</h3>
              <div className="button-wrapper">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => onCarSelect(cars)}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AvailableCars;
