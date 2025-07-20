import { useState, useEffect, useRef } from "react";
import { GiGearStickPattern } from "react-icons/gi";
import { PiSeatbelt, PiPath, PiSpeedometer } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { RiSteering2Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import AddUnit from "./AddUnit";
import SecondaryLoadingScreen from "../SecondaryLoadingScreen";
import UnitDetails from "./UnitDetails";
import axios from "axios";

function CarDetails({ car, onUpdate }) {
  const fileInputRef = useRef();
  const [carImage, setCarImage] = useState(null);
  const [editingImagePath, setEditingImagePath] = useState(null);
  const [editingKeyImagePath, setEditingKeyImagePath] = useState(null);
  const [editingLogoPath, setEditingLogoPath] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [addImagePath, setAddImagePath] = useState(null);
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (car && car.keyImage) {
      setCarImage(car.keyImage);
    }
  }, [car]);

  useEffect(() => {
    setIsEditable(false);
    setIsEditableUnit(false);
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
    if (!car) return;
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_car_units", {
          params: { id: car._id },
        });
        console.log("units:", response);
        if (!isEditableUnit) {
          setUnit(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [car, isEditableUnit]);

  useEffect(() => {
    setAvailableUnit(unit.length);
  }, [unit]);

  if (!car) {
    return (
      <div className="col-span-8 row-span-12 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
        <div className="flex justify-center items-center h-full text-xl font-bold">
          Select a Car
        </div>
      </div>
    );
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

  const handleEditKeyImage = (keyImagePath) => {
    setEditingKeyImagePath(keyImagePath);
    fileInputRef.current.click();
  };
  const handleEditLogo = (logoPath) => {
    setEditingLogoPath(logoPath);
    fileInputRef.current.click();
  };

  const handleEditImage = (imagePath) => {
    setEditingImagePath(imagePath);
    fileInputRef.current.click();
  };
  const handleAddImage = (newImagePath) => {
    setAddImagePath(newImagePath);
    fileInputRef.current.click();
  };

  const handleDeleteImage = async (imagePath) => {
    setLoading(true);
    try {
      const response = await axios.delete("/admin/delete_car_image", {
        data: { carId: car._id, imagePath },
      });
      const { updatedCar } = response.data;
      onUpdate(updatedCar);
    } catch (err) {
      console.error(err);
    } finally {
      await new Promise((res) => setTimeout(res, 2000));
      setLoading(false);
    }
    // console.log("Deleted:", response.data);
  };

  const handleDeleteCar = async () => {
    const response = await axios.delete("/admin/delete_car_model", {
      data: {
        carId: car._id,
      },
    });
    //console.log("Deleted:", response.data);
    setIsEditable(false);
    onUpdate(null);
  };
  const onImageSelected = async (e) => {
    const file = e.target.files[0];
    if (file == null) {
      return;
    }
    const formData = new FormData();
    if (editingImagePath) {
      formData.append("image", file);
      formData.append("imagePath", editingImagePath);
    }
    if (editingKeyImagePath) {
      console.log("editingKeyImagePath:", editingKeyImagePath);
      formData.append("keyImage", file);
    }
    if (addImagePath) {
      formData.append("newImage", file);
    }

    if (editingLogoPath != null) {
      console.log(editingLogoPath);
      formData.append("logo", file);
    }
    formData.append("carId", car._id);

    try {
      await axios.patch("/admin/update_car_image", formData);
    } catch (err) {
      console.error("Image update failed:", err);
    } finally {
      setEditingImagePath(null);
      setEditingKeyImagePath(null);
      setAddImagePath(null);
      setEditingLogoPath(null);
      fileInputRef.current.value = "";
    }
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
      const {
        data: { updatedCar },
      } = await axios.post("/admin/update_car_model", formData);
      onUpdate(updatedCar);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setIsEditable(false);
  };

  const onCancel = () => {
    setIsEditable(false);
  };

  return (
    <div className="col-span-8 row-span-12 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] relative">
      <div className="flex flex-col gap-5 h-full overflow-auto">
        <div className="flex flex-col gap-5">
          <input
            type="file"
            accept="image/*" 
            ref={fileInputRef}
            className="hidden"
            onChange={onImageSelected}
          />
          <div className="relative group">
            <img src={carImage} className="w-full rounded-lg" />
            {isEditable && (
              <div className=" absolute inset-0 bg-black rounded-lg bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 transition-opacity">
                <button
                  onClick={() => handleEditKeyImage(car.keyImage)}
                  className="bg-white rounded-full p-2"
                >
                  <FaRegEdit className="w-6 h-6 [&>path:not([fill='none'])]:fill-[url(#icon-gradient)]" />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-row overflow-auto gap-5 justify-start">
            {console.log(car.images)}
            {car.images.map((image, index) => (
              <div className="flex-none relative group" key={index}>
                <img
                  src={image}
                  onClick={() => setCarImage(image)}
                  className="w-50 rounded-lg object-cover"
                />
                {isEditable && (
                  <div className=" absolute inset-0 bg-black rounded-lg bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 transition-opacity">
                    <button
                      onClick={() => handleEditImage(image)}
                      className="bg-white rounded-full p-2"
                    >
                      <FaRegEdit className="w-6 h-6 [&>path:not([fill='none'])]:fill-[url(#icon-gradient)]" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="bg-white rounded-full p-2"
                    >
                      <ImBin className="w-6 h-6 [&>path:not([fill='none'])]:fill-[url(#icon-gradient)]" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <div>
              <div className="relative group">
                <img
                  src={car.logo}
                  alt="logo"
                  className="w-50 rounded-lg object-cover"
                />
                {isEditable && (
                  <div className=" absolute inset-0 bg-black rounded-lg bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-2 transition-opacity">
                    <button
                      onClick={() => handleEditLogo(car.logo ?? "")}
                      className="bg-white rounded-full p-2"
                    >
                      <FaRegEdit className="w-6 h-6 [&>path:not([fill='none'])]:fill-[url(#icon-gradient)]" />
                    </button>
                  </div>
                )}
              </div>
            </div>
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
                <p>Available :{availableUnit} Units</p>
              </>
            )}
          </div>
          <div>
            <div className="flex gap-2">
              {isEditable ? (
                <>
                  <div className="button-wrapper">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={handleAddImage}
                    >
                      Add Image
                    </button>
                  </div>
                  <div className="button-wrapper">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={() => setShowConfirmDelete(true)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="button-wrapper">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={onSave}
                    >
                      Save
                    </button>
                  </div>
                  <div className="button-wrapper">
                    <button
                      type="button"
                      className="button-primary"
                      onClick={onCancel}
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
                      onClick={onEdit}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="button-wrapper">
                    <button
                      type="button"
                      className="button-primary"
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
        <div className="flex flex-row gap-4 flex-none overflow-auto px-4">
          {unit.map((unit) => {
            return (
              <UnitDetails
                key={unit._id}
                unit={unit}
                onEdit={setIsEditableUnit}
              />
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
      {showConfirmDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4">Really delete this car?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>
              <div className="button-wrapper">
                <button
                  className="button-primary"
                  onClick={() => {
                    handleDeleteCar();
                    setShowConfirmDelete(false);
                  }}
                >
                  Yes, delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 backdrop-blur-sm rounded-lg bg-opacity-50  flex justify-center items-center gap-2 transition-opacity">
          <SecondaryLoadingScreen />
        </div>
      )}
    </div>
  );
}

export default CarDetails;
