import React, { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const TripHistory = () => {
  const [userId, setUserId] = useState("");
  const [tripHistory, setTripHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchUserIdAndTrips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        if (res.data?.user?._id) {
          const id = res.data.user._id;
          setUserId(id);
          await fetchTripHistory(id);
        } else {
          console.error("User data not found in response:", res.data);
        }
      } catch (err) {
        console.error("❌ Failed to get user ID:", err);
      }
    };

    fetchUserIdAndTrips();
  }, []);

  const fetchTripHistory = async (idToUse) => {
    if (!idToUse || typeof idToUse !== "string" || !idToUse.trim()) return;
    setLoading(true);
    setSubmitted(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/triphistory/${idToUse}`,
        { withCredentials: true }
      );
      setTripHistory(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch trip history:", error);
      setTripHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans bg-white min-h-screen">
      <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-6">
        Trip History
      </h2>

      {loading && <p className="text-gray-600">Loading trip history...</p>}

      {submitted && !loading && tripHistory.length === 0 && (
        <p className="text-gray-600">
          No trip history found for User ID: <strong>{userId}</strong>
        </p>
      )}

      {tripHistory.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <tr>
                <th className={thStyle}>#</th>
                <th className={thStyle}>Ride ID</th>
                <th className={thStyle}>Driver ID</th>
                <th className={thStyle}>Pickup</th>
                <th className={thStyle}>Dropoff</th>
                <th className={thStyle}>Fare</th>
                <th className={thStyle}>Distance</th>
                <th className={thStyle}>Duration</th>
                <th className={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tripHistory.map((trip, index) => (
                <tr key={trip._id || index} className="hover:bg-orange-50">
                  <td className={tdStyle}>{index + 1}</td>
                  <td className={tdStyle}>{trip.rideId}</td>
                  <td className={tdStyle}>{trip.driverId}</td>
                  <td className={tdStyle}>{trip.pickup}</td>
                  <td className={tdStyle}>{trip.dropoff}</td>
                  <td className={tdStyle}>Rs. {trip.fare}</td>
                  <td className={tdStyle}>{trip.distance}</td>
                  <td className={tdStyle}>{trip.duration}</td>
                  <td className={tdStyle}>{trip.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = "px-4 py-3 text-left text-sm font-medium";
const tdStyle = "px-4 py-3 border-t border-gray-200 text-sm text-gray-700";

export default TripHistory;
