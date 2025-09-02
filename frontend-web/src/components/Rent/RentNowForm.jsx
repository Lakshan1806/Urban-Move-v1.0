import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function RentNowForm({ onClose }) {
  const { user } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupTime: "",
    dropoffTime: "",
  });

  const [availableCars, setAvailableCars] = useState([]);
  const [loadingCar, setLoadingCar] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bookedCarId, setBookedCarId] = useState(null);

  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const res = await axios.get("/api/cars/locations");
      setLocations(res.data.data);
    } catch (err) {
      console.error("Error fetching locations", err);
      setError("Failed to load locations");
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const normalizePath = (path) =>
    path.replace(/\\/g, "/").replace("backend/uploads", "/uploads");

  const validateForm = () => {
    const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } =
      formData;

    if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
      setError("All fields are required.");
      return false;
    }

    const pickup = new Date(pickupTime);
    const dropoff = new Date(dropoffTime);

    if (pickup >= dropoff) {
      setError("Pickup time must be before dropoff time.");
      return false;
    }

    if (pickup < new Date()) {
      setError("Pickup time must be in the future.");
      return false;
    }

    setError("");
    return true;
  };

  const fetchAvailableCar = async () => {
    if (!validateForm()) return;

    setLoadingCar(true);
    setError("");
    try {
      const res = await axios.get("/api/cars/available", {
        params: {
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.dropoffLocation,
          pickupTime: formData.pickupTime,
          dropoffTime: formData.dropoffTime,
        },
      });

      const data = res?.data?.data;
      if (!data) {
        setError("No response from server.");
        return;
      }

      const instances = data.instances || [];
      const cars = data.cars || [];

      if (instances.length === 0) {
        setError("No cars available for the selected criteria.");
        return;
      }

      const pickupDate = new Date(formData.pickupTime);
      const dropoffDate = new Date(formData.dropoffTime);
      const rentalDays = Math.ceil(
        (dropoffDate - pickupDate) / (1000 * 60 * 60 * 24)
      );

      const uniqueCarModels = new Map();

      instances.forEach((instance) => {
        const carModel = cars.find((car) => car?._id === instance?.carID);
        if (!carModel) {
          console.warn("Car model not found for instance:", instance);
          return;
        }

        if (!uniqueCarModels.has(carModel._id)) {
          const pricePerDay = Number(carModel?.price) || 0;

          uniqueCarModels.set(carModel._id, {
            carInstanceId: instance._id,
            carModel: carModel,
            totalPrice: rentalDays * pricePerDay,
            rentalDays,
            availableCount: 1,
          });
        } else {
          const existing = uniqueCarModels.get(carModel._id);
          uniqueCarModels.set(carModel._id, {
            ...existing,
            availableCount: existing.availableCount + 1,
          });
        }
      });

      const availableCarList = Array.from(uniqueCarModels.values());

      if (availableCarList.length === 0) {
        setError("No valid cars available after filtering.");
        return;
      }

      setAvailableCars(availableCarList);
    } catch (err) {
      console.error("Error fetching available cars", err);
      setError(
        err.response?.data?.message || "Failed to fetch available cars."
      );
    } finally {
      setLoadingCar(false);
    }
  };

  const handleBooking = async (carInstanceId, carModelId) => {
    try {
      await axios.post("/api/cars/book", {
        carInstanceId,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        pickupTime: formData.pickupTime,
        dropoffTime: formData.dropoffTime,
        userId: user._id,
      });

      setBookingSuccess(true);
      setBookedCarId(carInstanceId);
      setTimeout(() => {
        setBookingSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Booking error", error.response?.data || error.message);
      setError(
        "Booking failed: " +
          (error.response?.data?.message || "Something went wrong.")
      );
    }
  };

  const clearInputs = () => {
    setFormData({
      pickupLocation: "",
      dropoffLocation: "",
      pickupTime: "",
      dropoffTime: "",
    });
    setAvailableCars([]);
    setError("");
  };

  return (
    <div className="p-4 relative bg-white rounded-2xl w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">RENT A CAR</h1>

      {bookingSuccess && (
        <div className="bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded mt-4 text-center font-medium">
          Booking successful! Closing shortly...
        </div>
      )}

      <div className="mt-4 overflow-y-auto pr-2" style={{ maxHeight: "75vh" }}>
        <div className="flex justify-between mb-4">
          <button
            onClick={fetchLocations}
            className="button-primary"
            disabled={loadingLocations}
          >
            {loadingLocations ? "Refreshing..." : "Refresh Locations"}
          </button>
          <button
            onClick={clearInputs}
            className="button-primary"
          >
            Clear Inputs
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="pickupLocation" className="block font-medium mb-1">
              Pickup Location
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={loadingLocations}
            >
              <option value="">Select Pickup Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dropoffLocation" className="block font-medium mb-1">
              Dropoff Location
            </label>
            <select
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled={loadingLocations}
            >
              <option value="">Select Dropoff Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pickupTime" className="block font-medium mb-1">
              Pickup Time
            </label>
            <input
              id="pickupTime"
              type="datetime-local"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label htmlFor="dropoffTime" className="block font-medium mb-1">
              Dropoff Time
            </label>
            <input
              id="dropoffTime"
              type="datetime-local"
              name="dropoffTime"
              value={formData.dropoffTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min={formData.pickupTime || new Date().toISOString().slice(0, 16)}
            />
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          {availableCars.length === 0 && (
            <div className="button-wrapper w-full px-2 py-2 text-xl justify-center">
              <button
                type="button"
                onClick={fetchAvailableCar}
                className="button-primary w-full"
                disabled={loadingCar || loadingLocations}
              >
                {loadingCar ? "Finding Car..." : "Check Availability"}
              </button>
            </div>
          )}

          {availableCars.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-2xl text-center mb-4">
                Available Cars ({availableCars.length})
              </h3>

              <div className="flex flex-col gap-8">
                {availableCars.map((carData, idx) => (
                  <div key={idx} className="border rounded-xl p-4 shadow-md">
                    {carData.carModel?.keyImage && (
                      <img
                        src={normalizePath(carData.carModel.keyImage)}
                        alt="Main Car"
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p>
                        <strong>Model:</strong>{" "}
                        {carData.carModel?.model || "N/A"}
                      </p>
                      <p>
                        <strong>Brand:</strong>{" "}
                        {carData.carModel?.make || "N/A"}
                      </p>
                      <p>
                        <strong>Year:</strong> {carData.carModel?.year || "N/A"}
                      </p>
                      <p>
                        <strong>Seats:</strong>{" "}
                        {carData.carModel?.seat || "N/A"}
                      </p>
                      <p>
                        <strong>Fuel:</strong>{" "}
                        {carData.carModel?.fuelType || "N/A"}
                      </p>
                      <p>
                        <strong>Transmission:</strong>{" "}
                        {carData.carModel?.transmission || "N/A"}
                      </p>
                      <p>
                        <strong>Body Style:</strong>{" "}
                        {carData.carModel?.bodyStyle || "N/A"}
                      </p>
                      <p>
                        <strong>Mileage:</strong>{" "}
                        {carData.carModel?.mileage || "N/A"} km/l
                      </p>
                      <p>
                        <strong>Engine:</strong>{" "}
                        {carData.carModel?.engine || "N/A"}
                      </p>
                      <p>
                        <strong>Speed:</strong>{" "}
                        {carData.carModel?.speed || "N/A"} km/h
                      </p>
                      <p>
                        <strong>Available Units:</strong>{" "}
                        {carData.availableCount}
                      </p>

                      <p>
                        <strong>Price per day:</strong> $
                        {carData.carModel?.price || "N/A"}
                      </p>
                      <p>
                        <strong>Rental Days:</strong> {carData.rentalDays}
                      </p>
                      <p className="col-span-2 font-bold text-lg">
                        <strong>Total Price:</strong> ${carData.totalPrice}
                      </p>
                      <p className="col-span-2">
                        <strong>Description:</strong>{" "}
                        {carData.carModel?.description || "N/A"}
                      </p>
                    </div>

                    {carData.carModel?.images?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">More Images</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {carData.carModel.images.map((img, i) => (
                            <img
                              key={i}
                              src={normalizePath(img)}
                              alt={`Car ${i + 1}`}
                              className="rounded-lg border object-cover h-24 w-full"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="button-wrapper w-full px-2 py-2 text-xl justify-center mt-6">
                      <button
                        type="button"
                        onClick={() =>
                          handleBooking(
                            carData.carInstanceId,
                            carData.carModel._id
                          )
                        }
                        className={`button-primary w-full ${
                          bookedCarId === carData.carInstanceId
                            ? "bg-gray-500 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={bookedCarId === carData.carInstanceId}
                      >
                        {bookedCarId === carData.carInstanceId
                          ? "Booked"
                          : "Book This Car"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RentNowForm;