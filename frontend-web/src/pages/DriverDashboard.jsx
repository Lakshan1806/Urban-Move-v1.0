import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DriverDashboard = () => {
  const [assignedRides, setAssignedRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const trackingInterval = useRef(null);
  const navigate = useNavigate();

  // Get driver ID from auth (you'll need to implement this)
  const driverId = 'YOUR_DRIVER_ID'; // Replace with actual driver ID from auth

  // Fetch assigned rides on component mount
  useEffect(() => {
    const fetchAssignedRides = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/drivers/${driverId}/rides`);
        
        if (response.data.success) {
          setAssignedRides(response.data.data);
          // Automatically select the first ride if available
          if (response.data.data.length > 0) {
            setCurrentRide(response.data.data[0]);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assigned rides');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRides();

    // Get current driver location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Could not get your current location');
        }
      );
    }

    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, [driverId]);

  // Start ride tracking
  const startRide = async (rideId) => {
    try {
      setLoading(true);
      // Update ride status to in_progress
      const response = await axios.put(`http://localhost:5000/api/rides/${rideId}/status`, {
        status: 'in_progress'
      });

      if (response.data.success) {
        setCurrentRide(response.data.data);
        setIsTracking(true);
        
        // Start tracking interval
        trackingInterval.current = setInterval(() => {
          updateDriverPosition(rideId);
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start ride');
    } finally {
      setLoading(false);
    }
  };

  // Update driver position towards pickup/destination
  const updateDriverPosition = async (rideId) => {
    try {
      // Get current ride details
      const rideResponse = await axios.get(`http://localhost:5000/api/rides/${rideId}`);
      
      if (rideResponse.data.success) {
        const ride = rideResponse.data.data;
        let targetLocation;
        
        // If ride is in progress, move towards dropoff, else move towards pickup
        if (ride.status === 'in_progress') {
          targetLocation = ride.endLocation;
        } else {
          targetLocation = ride.startLocation;
        }

        // Get current driver location
        const currentLat = ride.driverLocation?.lat || driverLocation?.lat;
        const currentLng = ride.driverLocation?.lng || driverLocation?.lng;
        
        if (!currentLat || !currentLng) return;

        // Calculate new position (move 10% closer to target)
        const latDiff = targetLocation.lat - currentLat;
        const lngDiff = targetLocation.lng - currentLng;
        
        const newLat = currentLat + latDiff * 0.1;
        const newLng = currentLng + lngDiff * 0.1;
        
        // Update driver location in backend
        await axios.put(`http://localhost:5000/api/drivers/${rideId}/location`, {
          lat: newLat,
          lng: newLng
        });

        // Calculate progress
        const totalDistance = getDistanceFromLatLonInKm(
          ride.startLocation.lat,
          ride.startLocation.lng,
          ride.endLocation.lat,
          ride.endLocation.lng
        );
        
        const completedDistance = getDistanceFromLatLonInKm(
          ride.startLocation.lat,
          ride.startLocation.lng,
          newLat,
          newLng
        );
        
        setProgress(Math.min(100, Math.max(0, (completedDistance / totalDistance) * 100)));

        // If we're very close to target, complete the step
        if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
          if (ride.status === 'in_progress') {
            // Complete the ride
            await axios.put(`http://localhost:5000/api/rides/${rideId}/complete`);
            setIsTracking(false);
            clearInterval(trackingInterval.current);
            setCurrentRide(null);
          } else {
            // Reached pickup location, start the ride
            await startRide(rideId);
          }
        }
      }
    } catch (err) {
      console.error('Error updating driver position:', err);
    }
  };

  // Helper function to calculate distance between coordinates
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Driver Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Assigned Rides */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Assigned Rides</h2>
          {loading && !assignedRides.length ? (
            <p>Loading rides...</p>
          ) : assignedRides.length === 0 ? (
            <p className="text-gray-500">No rides assigned</p>
          ) : (
            <ul className="space-y-3">
              {assignedRides.map(ride => (
                <li 
                  key={ride._id} 
                  className={`p-3 rounded border ${currentRide?._id === ride._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{ride.pickup} → {ride.dropoff}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(ride.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm mt-1">
                        Status: <span className="font-medium">{ride.status}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentRide(ride)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current Ride Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Ride</h2>
          {currentRide ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Route Details</h3>
                <p className="text-gray-700">{currentRide.pickup} → {currentRide.dropoff}</p>
                <p className="text-sm text-gray-500">Distance: {currentRide.distance}</p>
                <p className="text-sm text-gray-500">Duration: {currentRide.duration}</p>
                <p className="text-sm text-gray-500">Fare: Rs. {currentRide.fare}</p>
              </div>

              <div>
                <h3 className="font-medium text-lg">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}% complete</p>
              </div>

              <div className="space-y-2">
                {currentRide.status === 'driver_assigned' && (
                  <button
                    onClick={() => startRide(currentRide._id)}
                    disabled={loading}
                    className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Starting...' : 'Start Ride'}
                  </button>
                )}

                {currentRide.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      clearInterval(trackingInterval.current);
                      setIsTracking(false);
                    }}
                    className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Stop Tracking
                  </button>
                )}

                <button
                  onClick={() => navigate(`/ride/${currentRide._id}`)}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Ride Details
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No ride selected</p>
          )}
        </div>

        {/* Map View */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Route Map</h2>
          <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
            {currentRide ? (
              <iframe
                title="Route Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&origin=${driverLocation?.lat || currentRide.startLocation.lat},${driverLocation?.lng || currentRide.startLocation.lng}&destination=${currentRide.endLocation.lat},${currentRide.endLocation.lng}&zoom=13`}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a ride to view map
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;