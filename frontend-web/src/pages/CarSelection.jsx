import { useState } from "react";
import axios from "axios";

const CarSelection = ({ cars, searchParams, onBookingComplete }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setBookingError("");
  };

  const handleBookCar = async () => {
    if (!selectedCar) return;

    setIsBooking(true);
    setBookingError("");

    try {
      await axios.post("http://localhost:5000/api/cars/book", {
        carId: selectedCar._id,
        pickupLocation: searchParams.pickupLocation,
        dropoffLocation: searchParams.dropoffLocation,
        pickupTime: searchParams.pickupTime,
        dropoffTime: searchParams.dropoffTime,
      });

      onBookingComplete();
    } catch (error) {
      setBookingError(
        error.response?.data?.message || "Error booking car. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  if (cars.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
        Available Cars
      </h2>

      <div className="mb-6 rounded-md bg-blue-50 p-4">
        <h3 className="mb-2 font-medium text-blue-800">Trip Details</h3>
        <p>
          <span className="font-medium">Pickup:</span>{" "}
          {searchParams.pickupLocation} on {formatDate(searchParams.pickupTime)}
        </p>
        <p>
          <span className="font-medium">Drop-off:</span>{" "}
          {searchParams.dropoffLocation} on{" "}
          {formatDate(searchParams.dropoffTime)}
        </p>
        <p>
          <span className="font-medium">Duration:</span>{" "}
          {searchParams.rentalDays} day
          {searchParams.rentalDays !== 1 ? "s" : ""}
        </p>
      </div>

      {bookingError && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {bookingError}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {cars.map((car) => (
          <div
            key={car._id}
            className={`cursor-pointer rounded-lg border p-4 transition-all ${
              selectedCar && selectedCar._id === car._id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-300 hover:shadow"
            }`}
            onClick={() => handleCarSelect(car)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold">{car.name}</h3>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {car.type.charAt(0).toUpperCase() + car.type.slice(1)}
              </span>
            </div>

            <p className="mb-2 text-gray-600">
              {car.year} {car.model}
            </p>

            <div className="rounded bg-gray-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">
                  ${car.pricePerDay} per day
                </span>
                <span className="text-lg font-bold">
                  ${car.totalPrice} total
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleBookCar}
          disabled={!selectedCar || isBooking}
          className={`rounded-md px-6 py-3 transition-colors ${
            selectedCar
              ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          } disabled:opacity-50`}
        >
          {isBooking
            ? "Processing..."
            : selectedCar
              ? `Book ${selectedCar.name}`
              : "Select a Car"}
        </button>
      </div>
    </div>
  );
};

export default CarSelection;
