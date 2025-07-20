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
    <div className="col-span-4 row-span-12  pb-0 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col gap-4 overflow-auto">
      <div className="sticky top-0 w-full z-20 bg-white/30 backdrop-blur-md px-4 py-5">
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
            className="p-4 mx-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4"
          >
            <img
              src={cars.keyImage}
              alt="car image"
              className="w-1/2 h-full rounded-lg object-cover"
            />
            <div className="flex flex-col w-1/2 gap-1">
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
