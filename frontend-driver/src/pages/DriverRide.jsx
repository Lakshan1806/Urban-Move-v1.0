import { useState, useEffect, useRef, useCallback } from "react";
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
  // State variables
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
    userName: ""
  });
  const [manualRideAccepted, setManualRideAccepted] = useState(false);
  const [tripStarted, setTripStarted] = useState(false);
  const [isFinishingTrip, setIsFinishingTrip] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const geocoderRef = useRef(null);
  const socketRef = useRef(null);

  // Constants
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "400px"
  };

  const sriLankaBounds = {
    north: 10,
    south: 5,
    east: 82,
    west: 79,
  };

  const API_BASE_URL = "http://localhost:5000";

  // Reset all ride data
  const resetRideData = useCallback(() => {
    setCurrentRide(null);
    setRideStatus("available");
    setDirections(null);
    setRideDetails({
      distance: "",
      duration: "",
      fare: "",
      status: "",
      scheduleTime: "",
      userName: "",
      userId:""
    });
    setShowAcceptModal(false);
    setPickupInput("");
    setDropoffInput("");
    setManualRideAccepted(false);
    setTripStarted(false);
  }, []);

  // Get current location using browser geolocation API
  const getCurrentLocation = useCallback(async () => {
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
          `${API_BASE_URL}/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
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

      if (currentRide && socketRef.current?.connected) {
        socketRef.current.emit("driver:location", {
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
  }, [currentRide]);

  // Start trip with manual locations
  const startTrip = useCallback(() => {
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
  }, [pickupInput, dropoffInput]);

  // Complete the current trip
  const finishTrip = useCallback(async () => {
    setIsFinishingTrip(true);
    try {
      const token = localStorage.getItem('token');
      const rideId = currentRide?._id || `ride_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const fareText = rideDetails.fare.replace(/[^0-9.]/g, '');
      const fareAmount = parseFloat(fareText);
      
      if (isNaN(fareAmount)) {
        throw new Error('Invalid fare amount');
      }

      const rideData = {
        rideId,
        
        userId: rideDetails.userId || "unknown",
        userName: rideDetails.userName || "Unknown",
        pickup: currentRide?.pickup || pickupInput,
        dropoff: currentRide?.dropoff || dropoffInput,
        startLocation: {
          lat: currentLocation?.lat || 0,
          lng: currentLocation?.lng || 0,
          address: currentAddress || "Unknown address"
        },
        endLocation: {
          lat: currentLocation?.lat || 0,
          lng: currentLocation?.lng || 0,
          address: currentAddress || "Unknown address"
        },
        driverLocationUpdates: locationHistory.map(loc => ({
          lat: loc.lat,
          lng: loc.lng,
          accuracy: loc.accuracy || 0,
          timestamp: loc.timestamp || new Date(),
          address: currentAddress || "Unknown address"
        })),
        distance: rideDetails.distance || "0 km",
        duration: rideDetails.duration || "0 mins",
        fare: fareAmount*1000,
        driverEarnings: fareAmount*1000*0.8,
        status: "completed",
        route: directions?.routes[0]?.overview_path?.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        })) || [],
        completedAt: new Date()
      };

      const response = await axios.post(
        "http://localhost:5000/api/driver-rides/save",
        rideData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to save ride');
      }

      setRideStatus("completed");
      setRideDetails(prev => ({ ...prev, status: "completed" }));
      alert("Ride completed and saved successfully!");
      setTimeout(resetRideData, 3000);

    } catch (error) {
      console.error('Finish trip error:', {
        error: error.response?.data || error.message,
        fullError: error
      });

      let errorMessage = 'Failed to complete trip';
      if (error.response) {
        errorMessage = error.response.data?.message || 
                     error.response.data?.error || 
                     JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Error: ${errorMessage}`);
    } finally {
      setIsFinishingTrip(false);
    }
  }, [currentRide, currentLocation, currentAddress, locationHistory, rideDetails, directions, resetRideData]);

  // Format duration from seconds to readable format
  const formatDuration = useCallback((seconds) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let result = "";
    if (hours > 0) result += `${hours} hr `;
    if (minutes > 0) result += `${minutes} min`;
    return result || "<1 min";
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: localStorage.getItem("token") || "DRIVER_AUTH_TOKEN"
      }
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server with ID:", socketInstance.id);
      setSocketConnected(true);
      const driverId = "680f384d4c417b3a83f65278";
      socketInstance.emit("driver:authenticate", driverId);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setSocketConnected(false);
      if (reason === "io server disconnect") {
        setTimeout(() => {
          socketInstance.connect();
        }, 1000);
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setSocketConnected(false);
    });

    socketInstance.on("reconnect_attempt", (attempt) => {
      console.log("Reconnection attempt:", attempt);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("Reconnection failed");
      setSocketConnected(false);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // Get initial location and set up watcher
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
  }, [getCurrentLocation]);

  // Initialize map services when loaded
  useEffect(() => {
    if (mapLoaded && window.google) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [mapLoaded]);

  // Calculate directions when dependencies change
  useEffect(() => {
    if (!currentLocation || !mapLoaded || !directionsServiceRef.current) return;
    if (!currentRide && !manualRideAccepted) return;

    let origin, destination;

    if (currentRide) {
      switch (rideStatus) {
        case "accepted":
          origin = currentLocation;
          destination = currentRide.pickupLocation || currentRide.pickup;
          break;
        case "in_progress":
          origin = currentLocation;
          destination = currentRide.dropoffLocation || currentRide.dropoff;
          break;
        default:
          return;
      }
    } else if (manualRideAccepted) {
      if (tripStarted && pickupInput && dropoffInput) {
        origin = pickupInput;
        destination = dropoffInput;
      } else if (pickupInput) {
        origin = currentLocation;
        destination = pickupInput;
      } else {
        return;
      }
    }

    if (!origin || !destination) return;

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
          
          if (result.routes[0]?.legs[0]) {
            const leg = result.routes[0].legs[0];
            setRideDetails(prev => ({
              ...prev,
              distance: leg.distance?.text || prev.distance,
              duration: leg.duration?.text || prev.duration
            }));
          }
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  }, [
    currentRide, 
    currentLocation, 
    rideStatus, 
    mapLoaded, 
    manualRideAccepted, 
    pickupInput, 
    tripStarted, 
    dropoffInput
  ]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [pickupRes, dropoffRes, detailsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/driver/pickup`),
          axios.get(`${API_BASE_URL}/api/driver/dropoff`),
          axios.get(`${API_BASE_URL}/api/driver/details`)
        ]);
        

        if (pickupRes.data.success && pickupRes.data.pickup) {
          setPickupInput(pickupRes.data.pickup);
          if (pickupRes.data.userName) {
            setRideDetails(prev => ({
              ...prev,
              userName: pickupRes.data.userName
            }));
          }
        }
        if (dropoffRes.data.success && dropoffRes.data.dropoff) {
          setDropoffInput(dropoffRes.data.dropoff);
        }
        if (detailsRes.data.success && detailsRes.data.rideDetails) {
          if (detailsRes.data.rideDetails.status === 'in_progress') {
            setRideDetails(prev => ({
              ...prev,
              distance: detailsRes.data.rideDetails.distance || "",
              duration: detailsRes.data.rideDetails.duration || "",
              fare: detailsRes.data.rideDetails.fare ? `Rs. ${detailsRes.data.rideDetails.fare.toFixed(2)}` : "",
              status: detailsRes.data.rideDetails.status || "available",
              scheduleTime: detailsRes.data.rideDetails.scheduleTime ? 
                new Date(detailsRes.data.rideDetails.scheduleTime).toLocaleString() : "ASAP",
              userName: detailsRes.data.rideDetails.userDetails?.name || prev.userName,
              userId:detailsRes.data.rideDetails.userId
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // Handle map load
  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  // Handle map error
  const handleMapError = useCallback(() => {
    console.error("Google Maps failed to load");
  }, []);

  // Decline a ride
  const declineRide = useCallback(() => {
    if (socketRef.current?.connected && currentRide) {
      socketRef.current.emit("ride:decline", { rideId: currentRide._id });
    }
    resetRideData();
  }, [currentRide, resetRideData]);

  // Accept a ride
  const acceptRide = useCallback(() => {
    if (socketRef.current?.connected && currentRide) {
      socketRef.current.emit("ride:accept", { rideId: currentRide._id });
      setRideStatus("accepted");
      setRideDetails(prev => ({
        ...prev,
        status: "accepted"
      }));
      setShowAcceptModal(false);
    }
  }, [currentRide]);

  // Handle manual ride acceptance
  const handleManualAccept = useCallback(() => {
    if (pickupInput) {
      setManualRideAccepted(true);
      setRideDetails(prev => ({
        ...prev,
        status: "accepted"
      }));
    }
  }, [pickupInput]);

  // Handle manual ride decline
  const handleManualDecline = useCallback(() => {
    resetRideData();
  }, [resetRideData]);

  // Location status component
  const LocationStatus = useCallback(() => {
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
        <p className="text-sm text-gray-500">
          Socket status: {socketConnected ? (
            <span className="text-green-600">Connected</span>
          ) : (
            <span className="text-red-600">Disconnected</span>
          )}
        </p>
      </div>
    );
  }, [isLocating, locationError, currentLocation, currentAddress, socketConnected, getCurrentLocation]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Driver Ride Dashboard</h1>
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
                Passenger Name
              </label>
              <input
                type="text"
                readOnly
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                value={rideDetails.userName}
              />
            </div>

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
                    disabled={!pickupInput || manualRideAccepted}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !pickupInput || manualRideAccepted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {manualRideAccepted ? "Going to Pickup" : "Go to Pickup Location"}
                  </button>
                  <button
                    onClick={handleManualDecline}
                    disabled={manualRideAccepted}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      manualRideAccepted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    Decline
                  </button>
                </div>

                {manualRideAccepted && pickupInput && dropoffInput && (
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

            {(currentRide || tripStarted) && (
              <button
                onClick={finishTrip}
                disabled={isFinishingTrip}
                className={`w-full py-2 text-white font-medium rounded-lg hover:bg-red-700 mt-4 ${
                  isFinishingTrip ? "bg-red-400" : "bg-red-600"
                }`}
              >
                {isFinishingTrip ? "Finishing..." : "Finish Trip"}
              </button>
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
                  {rideDetails.userName || "Guest"}
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
                  <span className="font-medium">Passenger:</span>{" "}
                  {rideDetails.userName || "Guest"}
                </p>
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
                  Go to Pickup Location
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