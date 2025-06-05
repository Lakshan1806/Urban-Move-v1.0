import { useState, useEffect } from "react";
import axios from "axios";

function UnitDetails({ unit, onEdit }) {
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [isEditableUnit, setIsEditableUnit] = useState(false);

  useEffect(() => {
    if (unit) {
      setVin(unit.vin);
      setLicensePlate(unit.licensePlate);
      setColor(unit.color);
      setLocation(unit.location);
    }
  }, [unit]);

  const onEditUnit = () => {
    setIsEditableUnit(true);
    onEdit(true);
  };
  const onSaveUnit = async () => {
    const formData = { vin, licensePlate, color,location, _id: unit._id };

    try {
      const response = await axios.post("/admin/update_car_unit", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setIsEditableUnit(false);
    onEdit(false);
  };
  const onCancelUnit = () => {
    setIsEditableUnit(false);
  };

  return (
    <div className="p-4 my-2  rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row items-center gap-4">
      <div className="flex flex-col w-1/2">
        {isEditableUnit ? (
          <>
            <div>
              <label htmlFor="vin">VIN:</label>
              <input
                type="text"
                id="vin"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                required
                placeholder="Enter VIN"
              />
            </div>

            <div>
              <label htmlFor="licensePlate">License Plate:</label>
              <input
                type="text"
                id="licensePlate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
                placeholder="Enter License Plate"
              />
            </div>

            <div>
              <label htmlFor="color">Color:</label>
              <input
                type="text"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Enter car color"
              />
            </div>
            <div>
              <label htmlFor="color">Location:</label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter car location"
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-sm font-bold">{unit.vin}</h3>
            <h3 className="text-xl font-bold">{unit.licensePlate}</h3>
            <h3 className="text-xl font-bold">{unit.color}</h3>
            <h3 className="text-xl font-bold">{unit.location}</h3>
          </>
        )}
      </div>
      {isEditableUnit ? (
        <>
          <div className="button-wrapper">
            <button
              type="button"
              className="button-primary"
              onClick={onSaveUnit}
            >
              Save
            </button>
          </div>
          <div className="button-wrapper">
            <button
              type="button"
              className="button-primary"
              onClick={onCancelUnit}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="button-wrapper">
            <button
              type="button"
              className="button-primary"
            >
              Delete
            </button>
          </div>
          <div className="button-wrapper">
            <button
              type="button"
              className="button-primary"
              onClick={onEditUnit}
            >
              Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UnitDetails;
