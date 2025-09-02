import axios from "axios";
import { useEffect, useState } from "react";

function CarTypes() {
  const [car, setCar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_car_models");
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-span-4 row-span-8 flex flex-col gap-4 overflow-auto rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="sticky top-0 z-20 flex justify-center rounded-t-3xl bg-white/30 px-4 py-4 backdrop-blur-md">
        <h3 className="text-sm font-bold uppercase">Car Types</h3>
      </div>

      {car.map((cars) => {
        return (
          <div
            key={cars._id}
            className="mx-4 flex flex-row gap-4 rounded-xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
          >
            <img
              src={cars.keyImage}
              alt="car image"
              className="h-full w-1/2 rounded-lg object-cover"
            />
            <div className="flex w-1/2 flex-col">
              <h3 className="text-sm font-bold">{cars.make}</h3>
              <h3 className="text-xl font-bold">{cars.model}</h3>
              <h3 className="text-xl font-bold">{cars.bodyStyle}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CarTypes;
