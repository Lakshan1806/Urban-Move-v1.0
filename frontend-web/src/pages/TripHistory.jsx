import React, { useEffect, useState } from "react";

const TripHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/history/ramesh`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip history");
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  if (loading) return <p>Loading trip history...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Trip History</h2>
      {history.length === 0 ? (
        <p>No trip history found.</p>
      ) : (
        <ul>
          {history.map((trip) => (
            <li key={trip._id}>
              <strong>{trip.pickupLocation} → {trip.dropoffLocation}</strong><br />
              Fare: ${trip.fare} | Payment: {trip.paymentMethod} <br />
              Date: {new Date(trip.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripHistory;
