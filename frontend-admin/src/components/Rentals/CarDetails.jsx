import { useState, useEffect } from "react";
import { GiGearStickPattern } from "react-icons/gi";
import { PiSeatbelt, PiPath, PiSpeedometer } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { RiSteering2Line } from "react-icons/ri";
import AddUnit from "./AddUnit";
import axios from "axios";

function CarDetails({ car }) {
  const [carImage, setCarImage] = useState(null);
  const [addUnit, setAddUnit] = useState(false);
  const [unit, setUnit] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditableUnit, setIsEditableUnit] = useState(false);
  const [availableUnit, setAvailableUnit] = useState();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [transmission, setTransmission] = useState("");
  const [bodyStyle, setBodyStyle] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [seat, setSeat] = useState("");
  const [speed, setSpeed] = useState("");
  const [features, setFeatures] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [tempImage, setTempImage] = useState(null);
  const [description, setDescription] = useState("");
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (car && car.images && car.images.length > 0) {
      setCarImage(car.images[0]);
    }
  }, [car]);

  useEffect(() => {
    if (car && isEditable) {
      setMake(car.make);
      setModel(car.model);
      setYear(car.year);
      setEngine(car.engine);
      setTransmission(car.transmission);
      setBodyStyle(car.bodyStyle);
      setFuelType(car.fuelType);
      setMileage(car.mileage);
      setPrice(car.price);
      setSeat(car.seat);
      setSpeed(car.speed);
      setDescription(car.description);
    }
  }, [car, isEditable]);
  
  useEffect(() => {
    if (unit && isEditableUnit) {
      setVin(unit.vin);
      setLicensePlate(unit.licensePlate);
      setColor(unit.color);
    }
  }, [unit, isEditableUnit]);

  useEffect(() => {
    if (!car) return;
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_car_units", {
          params: { id: car._id },
        });
        setUnit(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [car]);

  useEffect(() => {
    setAvailableUnit(unit.length);
  }, [unit]);

  console.log("car:", car);

  if (!car) {
    return <div>Select a Car</div>;
  }

  let component = null;

  if (addUnit) {
    component = <AddUnit onSaveForm={setAddUnit} carID={car._id} />;
  } else {
    component = null;
  }

  const onAddUnit = () => {
    setAddUnit(true);
  };

  const onEdit = () => {
    setIsEditable(true);
  };
  const onEditUnit = () => {
    setIsEditableUnit(true);
  };
  const onSave = async () => {
    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("engine", engine);
    formData.append("transmission", transmission);
    formData.append("bodyStyle", bodyStyle);
    formData.append("fuelType", fuelType);
    formData.append("mileage", mileage);
    formData.append("price", price);
    formData.append("seat", seat);
    formData.append("speed", speed);
    formData.append("description", description);
    formData.append("_id", car._id);

    try {
      const response = await axios.post("/admin/update_car_model", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setIsEditable(false);
  };
  const onSaveUnit = () => {
    setIsEditableUnit(false);
  };
  const onCancel = () => {
    setIsEditable(false);
  };
  const onCancelUnit = () => {
    setIsEditableUnit(false);
  };

  return (
    <div className="flex flex-col gap-5 overflow-auto">
      <div className="flex flex-col  gap-5">
        <div className=" border-black">
          <img src={carImage} className="rounded-lg" />
        </div>
        <div className="flex flex-row  overflow-auto gap-5 justify-center">
          {car.images.map((image, index) => (
            <img
              src={image}
              key={index}
              onClick={() => setCarImage(image)}
              className="w-50 h-full rounded-lg object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          {isEditable ? (
            <>
              <div>
                <label htmlFor="bodystyle">Body Style:</label>
                <input
                  type="text"
                  id="bodystyle"
                  value={bodyStyle}
                  onChange={(e) => setBodyStyle(e.target.value)}
                  placeholder=""
                />
              </div>
              <div>
                <label htmlFor="make">Make:</label>
                <input
                  type="text"
                  id="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Audi"
                />
              </div>
              <div>
                <label htmlFor="model">Model:</label>
                <input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="A6"
                />
              </div>
              <div>
                <label htmlFor="year">Year:</label>
                <input
                  type="text"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder=""
                />
              </div>
            </>
          ) : (
            <>
              <p>{car.bodyStyle}</p>
              <h3 className="text-sm font-bold">
                {car.make} {car.model}
              </h3>
            </>
          )}

          <p>Available :{availableUnit} Units</p>
        </div>
        <div>
          <div className="flex gap-2">
            {isEditable ? (
              <>
                <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                  <button
                    type="button"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                    onClick={onSave}
                  >
                    Save
                  </button>
                </div>
                <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                  <button
                    type="button"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                  <button
                    type="button"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                    onClick={onEdit}
                  >
                    Edit
                  </button>
                </div>
                <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                  <button
                    type="button"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                  <button
                    type="button"
                    className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                    onClick={onAddUnit}
                  >
                    Add Unit
                  </button>
                </div>
              </>
            )}
          </div>
          {isEditable ? (
            <div>
              <label htmlFor="price">Price (per day):</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 50"
              />
            </div>
          ) : (
            <p>{car.price}$ /day</p>
          )}
        </div>
      </div>
      <div>
        {unit.map((unit) => {
          return (
            <div
              key={unit._id}
              className="p-4 my-2  rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4"
            >
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
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold">{unit.vin}</h3>
                    <h3 className="text-xl font-bold">{unit.licensePlate}</h3>
                    <h3 className="text-xl font-bold">{unit.color}</h3>
                  </>
                )}
              </div>
              {isEditableUnit ? (
                <>
                  <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                    <button
                      type="button"
                      className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                      onClick={onSaveUnit}
                    >
                      Save
                    </button>
                  </div>
                  <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                    <button
                      type="button"
                      className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                      onClick={onCancelUnit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                    <button
                      type="button"
                      className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                    <button
                      type="button"
                      className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                      onClick={onEditUnit}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <div>{component}</div>
      {isEditable ? (
        <div>
          <label htmlFor="description">About:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description or highlights"
          />
        </div>
      ) : (
        <div>About : {car.description}</div>
      )}

      <div className="grid grid-cols-3 justify-items-start gap-5">
        <div className="flex gap-5">
          <GiGearStickPattern className="w-[30px] h-[30px]" />
          {isEditable ? (
            <div>
              <label htmlFor="transmission">Transmission:</label>
              <input
                type="text"
                id="transmission"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                placeholder=""
              />
            </div>
          ) : (
            <div>
              <p>Transmission</p>
              <p>{car.transmission}</p>
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <PiSeatbelt className="w-[30px] h-[30px]" />
          {isEditable ? (
            <div>
              <label htmlFor="seat">Seats:</label>
              <input
                type="number"
                id="seat"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          ) : (
            <div>
              <p>Seats</p>
              <p>{car.seat}</p>
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <PiPath className="w-[30px] h-[30px]" />
          {isEditable ? (
            <div>
              <label htmlFor="mileage">Range (km on full tank):</label>
              <input
                type="number"
                id="mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 400"
              />
            </div>
          ) : (
            <div>
              <p>Mileage</p>
              <p>{car.mileage}</p>
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <BsFuelPump className="w-[30px] h-[30px]" />
          {isEditable ? (
            <div>
              <label htmlFor="fueltype">Fuel Type:</label>
              <input
                type="text"
                id="fueltype"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                placeholder=""
              />
            </div>
          ) : (
            <div>
              <p>Fuel Type</p>
              <p>{car.fuelType}</p>
            </div>
          )}
        </div>

        <div className="flex gap-5">
          <PiSpeedometer className="w-[30px] h-[30px]" />
          {isEditable ? (
            <div>
              <label htmlFor="speed">Speed:</label>
              <input
                type="number"
                id="speed"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="e.g. 150"
              />
            </div>
          ) : (
            <div>
              <p>Top Speed</p>
              <p>{car.speed}</p>
            </div>
          )}
        </div>
        <div className="flex gap-5">
          <RiSteering2Line className="w-[30px] h-[30px]" />
          {isEditable ? (
            <div>
              <label htmlFor="engine">Engine:</label>
              <input
                type="text"
                id="engine"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                placeholder=""
              />
            </div>
          ) : (
            <div>
              <p>Engine</p>
              <p>{car.engine}</p>
            </div>
          )}
        </div>
      </div>
      <div>car Features</div>
    </div>
  );
}

export default CarDetails;
