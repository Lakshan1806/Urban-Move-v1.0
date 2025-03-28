import axios from "axios";
import { useEffect, useState } from "react";

function AvailableCars() {
  const [car, setCar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_cars");
        console.log(response.data);
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
    <div className="col-span-6 row-span-12 p-4 rounded border border-black flex flex-col">
      {car.map((cars) => {
        console.log("data :", cars.images);
        return (
          <div key={cars._id} className="p-4 my-2 border-black rounded shadow">
            {cars.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="profile image"
                className="w-24 h-24 rounded-lg object-contain"
              />
            ))}

            <h3 className="text-lg font-bold">{cars.name}</h3>
            <p>Name: {cars.model}</p>
            <p>Make: {cars.make}</p>
          </div>
        );
      })}
    </div>
  );
}

export default AvailableCars;
