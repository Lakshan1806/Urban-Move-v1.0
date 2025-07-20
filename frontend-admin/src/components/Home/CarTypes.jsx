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
    <div className="col-span-4 row-span-8  rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col gap-4 overflow-auto ">
      <div className="sticky top-0 z-20 bg-white/30 rounded-t-3xl backdrop-blur-md px-4 py-4 flex justify-center">
        <h3 className="text-sm font-bold uppercase">Car Types</h3>
      </div>

      {car.map((cars) => {
        return (
          <div
            key={cars._id}
            className="p-4 mx-4 rounded-xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4 "
          >
            <img
              src={cars.keyImage}
              alt="car image"
              className="w-1/2 h-full rounded-lg object-cover"
            />
            <div className="flex flex-col w-1/2">
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
