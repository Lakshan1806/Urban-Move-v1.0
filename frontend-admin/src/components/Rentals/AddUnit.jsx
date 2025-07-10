import { useState } from "react";
import axios from "axios";

function AddUnit({ onSaveForm, carID }) {
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");

  const handleSave = async () => {
    const newCarData = { vin, licensePlate, color, location, carID };
    console.log("New Car Data:", newCarData);
    const response = await axios.post("/admin/add_unit", newCarData);
  };
  console.log("ref", carID);
  return (
    <div>
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
        <label htmlFor="vin">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          placeholder="Enter Location"
        />
      </div>
      <div className="flex flex-row items-center justify-center gap-5">
        <div className="button-wrapper">
          <button type="button" className="button-primary" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="button-wrapper">
          <button
            type="button"
            className="button-primary"
            onClick={() => {
              onSaveForm(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddUnit;
