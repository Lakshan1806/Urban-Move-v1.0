import axios from "axios";
import { useEffect, useState } from "react";

function CurrentActivity() {
  const [car, setCar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_rent_bookings");
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

  return (
    <div className="col-span-6 row-span-6 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
      {car.map((cars) => {
        console.log("data :", cars);
        console.log("data :", cars.images);
        return (
          <div
            key={cars._id}
            className="p-4 my-2  rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4"
          >
            {/* <img
              src={cars.keyImage}
              alt="car image"
              className="w-1/2 h-full rounded-lg object-cover"
            /> */}
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-bold">{cars.pickupLocation}</h3>
              <h3 className="text-xl font-bold">{cars.dropoffLocation}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CurrentActivity;
