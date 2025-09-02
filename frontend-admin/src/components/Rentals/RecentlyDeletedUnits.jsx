import axios from "axios";
import { useEffect, useState } from "react";

function RecentlyDeletedUnits() {
  const [unit, setUnit] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_deleted_car_units");
        console.log("delunit :", response);
        setUnit(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const onRestore = async (unitID, carID) => {
    console.log("both ids", unitID, carID);
    try {
      const response = await axios.post(
        "/admin/restore_car_units",
        {},
        {
          params: {
            carID: carID,
            unitID: unitID,
          },
        },
      );
      console.log("res :", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="col-span-8 row-span-6 flex flex-col overflow-auto rounded-3xl px-4 pt-4 pb-0 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      {unit.map((unit) => {
        return (
          <div
            key={unit._id}
            className="my-2 flex flex-row gap-4 rounded p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
          >
            {/* <img
              src={cars.keyImage}
              alt="car image"
              className="w-1/2 h-full rounded-lg object-cover"
            /> */}

            <div className="flex flex-row gap-3">
              <h3 className="text-xl font-bold">{unit.vin}</h3>
              <h3 className="text-xl font-bold">{unit.licensePlate}</h3>
              <h3 className="text-xl font-bold">{unit.color}</h3>
              <h3 className="text-xl font-bold">{unit.location}</h3>
              <div className="button-wrapper">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => onRestore(unit._id, unit.carID)}
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

export default RecentlyDeletedUnits;
