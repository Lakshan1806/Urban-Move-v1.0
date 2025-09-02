import axios from "axios";
import { useEffect, useState } from "react";

function RecentlyDeletedCars() {
  const [car, setCar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_deleted_car_models");
        console.log("RAW response.data:", response.data);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const onRestore = async (id) => {
    try {
      const response = await axios.post(
        "/admin/restore_car_models",
        {},
        {
          params: { id },
        },
      );
      console.log("res :", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="col-span-4 row-span-6 flex flex-col overflow-auto rounded-3xl px-4 pt-4 pb-0 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      {car.map((cars) => {
        console.log("data :", cars);
        console.log("data :", cars.images);
        return (
          <div
            key={cars._id}
            className="my-2 flex flex-row gap-4 rounded p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
          >
            <img
              src={cars.keyImage}
              alt="car image"
              className="h-full w-1/2 rounded-lg object-cover"
            />
            <div className="flex w-1/2 flex-col">
              <h3 className="text-sm font-bold">{cars.make}</h3>
              <h3 className="text-xl font-bold">{cars.model}</h3>
              <div className="button-wrapper">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => onRestore(cars._id)}
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecentlyDeletedCars;
