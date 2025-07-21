import axios from "axios";
import { useEffect, useState } from "react";

function CurrentActivity() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_rent_bookings");
        console.log("RAW response.data:", response.data);
        setBookings(response.data);
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
      {bookings.map((booking) => {
        return (
          <div
            key={booking._id}
            className="p-4 my-2  rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4"
          >
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-bold">{booking.pickupLocation}</h3>
              <h3 className="text-xl font-bold">{booking.dropoffLocation}</h3>
              <h3 className="text-xl font-bold">
                {booking?.carInstance?.vin ?? "VIN unavailable"}
              </h3>
              <h3 className="text-xl font-bold">
                {booking?.carInstance?.licensePlate ??
                  "Number Plate unavailable"}
              </h3>
              <h3 className="text-xl font-bold">
                {booking?.carInstance?.color ?? "colour unavailable"}
              </h3>
              <h3 className="text-xl font-bold">
                {booking?.carModel?.make ?? "make unavailable"}
              </h3>
              <h3 className="text-xl font-bold">
                {booking?.carModel?.model ?? "model unavailable"}
              </h3>
              <h3 className="text-xl font-bold">{booking.user.username}</h3>
              <h3 className="text-xl font-bold">{booking.user.phone}</h3>
              <h3 className="text-xl font-bold">{booking.user.email}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CurrentActivity;
