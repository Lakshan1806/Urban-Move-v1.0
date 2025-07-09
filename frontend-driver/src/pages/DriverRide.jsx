import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Polyline,
} from "@react-google-maps/api";
import { io } from "socket.io-client";
import axios from "axios";

const DriverRide = () => {
  const [socket, setSocket] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideStatus, setRideStatus] = useState("available");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("Loading address...");
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(true);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [pickupInput, setPickupInput] = useState("");
  const [dropoffInput, setDropoffInput] = useState("");
  const [locationHistory, setLocationHistory] = useState([]);
  const [rideDetails, setRideDetails] = useState({
    distance: "",
    duration: "",
    fare: "",
    status: "",
    scheduleTime: "",
  });
  const [manualRideAccepted, setManualRideAccepted] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);

  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const geocoderRef = useRef(null);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const sriLankaBounds = {
    north: 10,
    south: 5,
    east: 82,
    west: 79,
  };

  const resetRideData = () => {
    setCurrentRide(null);
    setRideStatus("available");
    setDirections(null);
    setRideDetails({
      distance: "",
      duration: "",
      fare: "",
      status: "",
      scheduleTime: "",
    });
    setShowAcceptModal(false);
    setPickupInput("");
    setDropoffInput("");
    setManualRideAccepted(false);
    setTripStarted(false);
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage;
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Location access was denied. Please enable permissions in your browser settings.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMessage = "The request to get location timed out.";
                break;
              default:
                errorMessage = "An unknown error occurred.";
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0,
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      const newLocation = {
        lat: latitude,
        lng: longitude,
        accuracy,
        timestamp: new Date(),
      };

      setCurrentLocation(newLocation);
      setLocationHistory((prev) => [...prev.slice(-50), newLocation]);
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
        );

        if (response.data.status === "SUCCESS") {
          setCurrentAddress(response.data.address);
        } else {
          throw new Error(response.data.message || "Failed to get address");
        }
      } catch (error) {
        console.error("Reverse geocode error:", error);
        setCurrentAddress("Address not available");
      }

      if (currentRide && socket) {
        socket.emit("driver:location", {
          rideId: currentRide._id,
          location: { lat: latitude, lng: longitude },
          accuracy,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(error.message || "Failed to get your location");
    } finally {
      setIsLocating(false);
    }
  };

  const startTrip = () => {
    if (!pickupInput || !dropoffInput || !directionsServiceRef.current) {
      return;
    }

    setTripStarted(true);

    directionsServiceRef.current.route(
      {
        origin: pickupInput,
        destination: dropoffInput,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  };

  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    getCurrentLocation();

    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newLocation = {
            lat: latitude,
            lng: longitude,
            accuracy,
            timestamp: new Date(),
          };
          setCurrentLocation(newLocation);
          setLocationHistory((prev) => [...prev.slice(-50), newLocation]);
        },
        (error) => {
          console.error("Geolocation watch error:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && window.google) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (ride) => {
      if (!currentRide) {
        setCurrentRide(ride);
        setRideDetails({
          distance: (ride.distance / 1000).toFixed(1) + " km",
          duration: formatDuration(ride.duration),
          fare: "Rs. " + ride.fare?.toFixed(2) || "0.00",
          status: "requested",
          scheduleTime: ride.scheduleTime || "ASAP",
        });
        setShowAcceptModal(true);
        setRideStatus("requested");
        setManualRideAccepted(false);
      }
    };

    const handleRideUpdate = (updatedRide) => {
      if (currentRide && currentRide._id === updatedRide._id) {
        setCurrentRide(updatedRide);
        setRideDetails(prev => ({
          ...prev,
          status: updatedRide.status,
          scheduleTime: updatedRide.scheduleTime || prev.scheduleTime,
        }));
      }
    };

    const handleRideCompletion = () => {
      setRideStatus("completed");
      setRideDetails(prev => ({
        ...prev,
        status: "completed"
      }));
      setTimeout(() => {
        resetRideData();
      }, 3000);
    };

    const handleRideCanceled = (rideId) => {
      if (currentRide && currentRide._id === rideId) {
        resetRideData();
      }
    };

    socket.on("ride:requested", handleNewRide);
    socket.on("ride:updated", handleRideUpdate);
    socket.on("ride:completed", handleRideCompletion);
    socket.on("ride:canceled", handleRideCanceled);

    return () => {
      socket.off("ride:requested", handleNewRide);
      socket.off("ride:updated", handleRideUpdate);
      socket.off("ride:completed", handleRideCompletion);
      socket.off("ride:canceled", handleRideCanceled);
    };
  }, [socket, currentRide]);

  const formatDuration = (seconds) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let result = "";
    if (hours > 0) result += `${hours} hr `;
    if (minutes > 0) result += `${minutes} min`;
    return result || "<1 min";
  };

  useEffect(() => {
    if (
      !currentLocation ||
      !mapLoaded ||
      !directionsServiceRef.current
    )
      return;

    let origin, destination;

    if (currentRide) {
      if (rideStatus === "accepted") {
        origin = currentLocation;
        destination = currentRide.pickup;
      } else if (rideStatus === "in_progress") {
        origin = currentLocation;
        destination = currentRide.dropoff;
      } else {
        return;
      }
    } else if (manualRideAccepted && pickupInput) {
      origin = currentLocation;
      destination = pickupInput;
    } else if (tripStarted && pickupInput && dropoffInput) {
      return;
    } else {
      return;
    }

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
        optimizeWaypoints: true,
        avoidFerries: true,
        avoidTolls: true,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  }, [currentRide, currentLocation, rideStatus, mapLoaded, manualRideAccepted, pickupInput, tripStarted, dropoffInput]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  const handleMapError = () => {
    console.error("Google Maps failed to load");
  };

  const declineRide = () => {
    if (socket && currentRide) {
      socket.emit("ride:decline", { rideId: currentRide._id });
    }
    resetRideData();
  };

  const acceptRide = () => {
    if (socket && currentRide) {
      socket.emit("ride:accept", { rideId: currentRide._id });
      setRideStatus("accepted");
      setRideDetails(prev => ({
        ...prev,
        status: "accepted"
      }));
      setShowAcceptModal(false);
    }
  };

  const handleManualAccept = () => {
    if (pickupInput) {
      setManualRideAccepted(true);
      setRideDetails(prev => ({
        ...prev,
        status: "accepted"
      }));
    }
  };

  const handleManualDecline = () => {
    resetRideData();
  };

  const userId = "680f384d4c417b3a83f65278";
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [pickupRes, dropoffRes, detailsRes] = await Promise.all([
          axios.get(`/api/driver/pickup/${userId}`),
          axios.get(`/api/driver/dropoff/${userId}`),
          axios.get(`/api/driver/details/${userId}`)
        ]);

        if (pickupRes.data.success) {
          setPickupInput(pickupRes.data.pickup || "");
        }
        if (dropoffRes.data.success) {
          setDropoffInput(dropoffRes.data.dropoff || "");
        }
        if (detailsRes.data.success) {
          setRideDetails({
            distance: detailsRes.data.rideDetails.distance || "",
            duration: detailsRes.data.rideDetails.duration || "",
            fare: detailsRes.data.rideDetails.fare ? `Rs. ${detailsRes.data.rideDetails.fare.toFixed(2)}` : "",
            status: detailsRes.data.rideDetails.status || "available",
            scheduleTime: detailsRes.data.rideDetails.scheduleTime ? 
              new Date(detailsRes.data.rideDetails.scheduleTime).toLocaleString() : "ASAP"
          });
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    if (userId) {
      fetchInitialData();
    }
  }, []);

  const LocationStatus = () => {
    if (isLocating) {
      return (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <span>Detecting your location...</span>
        </div>
      );
    }

    if (locationError) {
      return (
        <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
          <p className="font-medium text-red-700">Location Error</p>
          <p className="text-sm text-red-600">{locationError}</p>
          <button
            onClick={getCurrentLocation}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!currentLocation) {
      return (
        <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
          <p className="text-yellow-700">Waiting for GPS signal...</p>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Address:</span> {currentAddress}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Driver Ride Dashboard</h1>
          {currentLocation && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm">Live GPS</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 bg-white p-4 border-r border-gray-200 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Current Location
            </h2>
            
            <LocationStatus />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <input
                id="pickup-input"
                type="text"
                placeholder="Enter pickup location"
                className="w-full p-2 border border-gray-300 rounded"
                value={pickupInput}
                onChange={(e) => setPickupInput(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drop-off Location
              </label>
              <input
                id="dropoff-input"
                type="text"
                placeholder="Enter drop-off location"
                className="w-full p-2 border border-gray-300 rounded"
                value={dropoffInput}
                onChange={(e) => setDropoffInput(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={rideDetails.distance}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={rideDetails.duration}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fare
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                  value={rideDetails.fare}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 capitalize"
                  value={rideDetails.status.replace("_", " ")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Time
              </label>
              <input
                type="text"
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                value={rideDetails.scheduleTime}
              />
            </div>

            {!currentRide && (
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleManualAccept}
                    disabled={!pickupInput}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !pickupInput
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleManualDecline}
                    disabled={!manualRideAccepted}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !manualRideAccepted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Decline
                  </button>
                </div>

                {pickupInput && dropoffInput && (
                  <button
                    onClick={startTrip}
                    disabled={tripStarted}
                    className={`w-full py-2 rounded-lg font-medium ${
                      tripStarted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Start Trip
                  </button>
                )}
              </div>
            )}
          </div>

          {currentRide && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Current Ride Details
              </h2>

              <div className="space-y-3 bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">Passenger:</span>{" "}
                  {currentRide.passengerId?.name || "Guest"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Pickup:</span>{" "}
                  {currentRide.pickupLocation?.address || "Current location"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Destination:</span>{" "}
                  {currentRide.dropoffLocation?.address || "Unknown"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Distance:</span>{" "}
                  {rideDetails.distance}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Duration:</span>{" "}
                  {rideDetails.duration}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Fare:</span>{" "}
                  {rideDetails.fare}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">
                    {rideDetails.status.replace("_", " ")}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Scheduled Time:</span>{" "}
                  {rideDetails.scheduleTime}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-2/3 relative">
          <LoadScript
            googleMapsApiKey="AIzaSyBzy5MB38A69NzcnngmihjBajzg0eNZsTk"
            libraries={["places", "geometry"]}
            onLoad={handleMapLoad}
            onError={handleMapError}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || { lat: 6.9271, lng: 79.8612 }}
              zoom={currentLocation ? 15 : 12}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: "greedy",
                restriction: {
                  latLngBounds: sriLankaBounds,
                  strictBounds: false,
                },
              }}
            >
              {!currentLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg text-center max-w-xs">
                  <p className="font-medium">Waiting for your location</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {locationError ? locationError : "This may take a moment..."}
                  </p>
                </div>
              )}

              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  label="You"
                />
              )}

              {locationHistory.length > 1 && (
                <Polyline
                  path={locationHistory.map((loc) => ({
                    lat: loc.lat,
                    lng: loc.lng,
                  }))}
                  options={{
                    strokeColor: "#3b82f6",
                    strokeOpacity: 0.7,
                    strokeWeight: 4,
                    geodesic: true,
                    clickable: false,
                  }}
                />
              )}

              {currentRide && (
                <Marker
                  position={currentRide.pickupLocation}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  label="P"
                />
              )}

              {currentRide && rideStatus === "in_progress" && (
                <Marker
                  position={currentRide.dropoffLocation}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  label="D"
                />
              )}

              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: "#3b82f6",
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                    },
                    preserveViewport: true,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {showAcceptModal && currentRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                New Ride Request
              </h2>

              <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">From:</span>{" "}
                  {currentRide.pickup}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">To:</span> {currentRide.dropoff}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Distance:</span>{" "}
                  {rideDetails.distance}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Duration:</span>{" "}
                  {rideDetails.duration}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Fare:</span>{" "}
                  {rideDetails.fare}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Scheduled Time:</span>{" "}
                  {rideDetails.scheduleTime}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={declineRide}
                  className="flex-1 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md"
                >
                  Decline
                </button>
                <button
                  onClick={acceptRide}
                  className="flex-1 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRide;
