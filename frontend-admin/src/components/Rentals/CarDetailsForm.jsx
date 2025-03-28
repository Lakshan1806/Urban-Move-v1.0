import { useState, useRef } from "react";
import axios from "axios";

function CarDetailsForm() {
  const fileInputRef = useRef(null);
  const [make, setMake] = useState("");
  const [about, setAbout] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [capacitySeats, setCapacitySeats] = useState("");
  const [vin, setVin] = useState("");
  const [licensePlate, setlicensePlate] = useState("");
  const [range, setRange] = useState("");
  const [price, setPrice] = useState("");
  const [unitsAvailable, setUnitsAvailable] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [tempImage, setTempImage] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    } else {
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageUrl(previewUrls);
      setTempImage(files);
    }
  };

  const handleSave = async (e) => {
    const formData = new FormData();
    formData.append("make", make);
    formData.append("about", about);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("capacitySeats", capacitySeats);
    formData.append("vin", vin);
    formData.append("licensePlate", licensePlate);
    formData.append("range", range);
    formData.append("price", price);
    formData.append("unitsAvailable", unitsAvailable);

    console.log(tempImage); // Should show a FileList in the console.
    console.log(tempImage.constructor.name); // Likely outputs "FileList"

    if (tempImage) {
      Array.from(tempImage).forEach((file) => {
        formData.append("photos", file);
      });
    }

    try {
      const response = await axios.post("/admin/add_cars", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="col-span-12 row-span-12 p-4 rounded-xl border border-black flex flex-col">
      <div>
        <h2>Add Car Details</h2>
        <div className="flex flex-row">
          {imageUrl.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index}`}
              className="w-24 h-24 rounded-lg object-cover"
            />
          ))}

          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px]">
            <button
              type="button"
              className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
              onClick={handleImageClick}
            >
              Upload new photo
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="carName">Make:</label>
          <input
            type="text"
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Audi"
          />
        </div>

        <div>
          <label htmlFor="about">About:</label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Short description or highlights"
          />
        </div>

        <div>
          <label htmlFor="transmission">Model:</label>
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="A6"
          />
        </div>

        <div>
          <label htmlFor="fuel">Year:</label>
          <input
            type="text"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="capacitySeats">Seats:</label>
          <input
            type="number"
            id="capacitySeats"
            value={capacitySeats}
            onChange={(e) => setCapacitySeats(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>

        <div>
          <label htmlFor="topSpeed">VIN:</label>
          <input
            type="number"
            id="vin"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="acceleration">License:</label>
          <input
            type="text"
            id="licensePlate"
            value={licensePlate}
            onChange={(e) => setlicensePlate(e.target.value)}
            placeholder=""
          />
        </div>

        <div>
          <label htmlFor="range">Range (miles on full tank):</label>
          <input
            type="number"
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="e.g. 400"
          />
        </div>

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

        <div>
          <label htmlFor="unitsAvailable">Units Available:</label>
          <input
            type="number"
            id="unitsAvailable"
            value={unitsAvailable}
            onChange={(e) => setUnitsAvailable(e.target.value)}
            placeholder="e.g. 12"
          />
        </div>

        <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer">
          <button
            type="button"
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
            onClick={handleSave}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarDetailsForm;
