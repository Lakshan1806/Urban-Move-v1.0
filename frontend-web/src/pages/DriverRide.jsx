import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Polyline,
} from "@react-google-maps/api";
import { io } from "socket.io-client";

const DriverRide = () => {
  // State management
  const [socket, setSocket] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);
  const [rideStatus, setRideStatus] = useState("available");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("Loading address...");
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [pickupInput, setPickupInput] = useState("");
  const [dropoffInput, setDropoffInput] = useState("");
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);

  const mapRef = useRef(null);
  const watchIdRef = useRef(null);
  const autocompleteRef = useRef({ pickup: null, dropoff: null });
  const directionsServiceRef = useRef(null);
  const geocoderRef = useRef(null);

  // Map configuration
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  // Default center - Colombo, Sri Lanka
  const defaultCenter = {
    lat: 6.9271,
    lng: 79.8612,
  };

  // Sri Lanka bounds
  const sriLankaBounds = {
    north: 10,    // Northernmost point
    south: 5,     // Southernmost point
    east: 82,     // Easternmost point
    west: 79      // Westernmost point
  };

  // Initialize Google Maps Autocomplete with Sri Lanka restriction
  const initAutocomplete = () => {
    if (window.google && window.google.maps) {
      autocompleteRef.current.pickup =
        new window.google.maps.places.Autocomplete(
          document.getElementById("pickup-input"),
          { 
            types: ["geocode"],
            componentRestrictions: { country: "lk" } // Sri Lanka only
          }
        );
      autocompleteRef.current.dropoff =
        new window.google.maps.places.Autocomplete(
          document.getElementById("dropoff-input"),
          { 
            types: ["geocode"],
            componentRestrictions: { country: "lk" } // Sri Lanka only
          }
        );

      autocompleteRef.current.pickup.addListener("place_changed", () => {
        const place = autocompleteRef.current.pickup.getPlace();
        if (place.formatted_address) {
          setPickupInput(place.formatted_address);
        }
      });

      autocompleteRef.current.dropoff.addListener("place_changed", () => {
        const place = autocompleteRef.current.dropoff.getPlace();
        if (place.formatted_address) {
          setDropoffInput(place.formatted_address);
        }
      });
    }
  };

  // Get address from coordinates with Sri Lanka bias
  const getAddressFromCoordinates = (lat, lng) => {
    if (!geocoderRef.current) return;
    
    geocoderRef.current.geocode(
      { 
        location: { lat, lng },
        region: "lk" // Sri Lanka region bias
      },
      (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            setCurrentAddress(results[0].formatted_address);
          } else {
            setCurrentAddress("Address not found");
          }
        } else {
          console.error("Geocoder failed due to: " + status);
          setCurrentAddress("Could not determine address");
        }
      }
    );
  };

  // Initialize socket connection
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

  // Initialize geolocation tracking
  useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      };

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
          getAddressFromCoordinates(latitude, longitude);

          setLocationHistory((prev) => [...prev.slice(-50), newLocation]);

          if (currentRide && socket) {
            socket.emit("driver:location", {
              rideId: currentRide._id,
              location: { lat: latitude, lng: longitude },
              accuracy,
              timestamp: new Date().toISOString(),
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ lat: latitude, lng: longitude });
              getAddressFromCoordinates(latitude, longitude);
            },
            (fallbackError) => {
              console.error("Fallback geolocation error:", fallbackError);
              setCurrentLocation(defaultCenter);
              setCurrentAddress("Default location - Colombo, Sri Lanka");
            },
            { enableHighAccuracy: false }
          );
        },
        options
      );
    } else {
      setCurrentLocation(defaultCenter);
      setCurrentAddress("Default location - Colombo, Sri Lanka");
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [currentRide, socket]);

  // Initialize map, autocomplete, and services when loaded
  useEffect(() => {
    if (mapLoaded && window.google) {
      initAutocomplete();
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      geocoderRef.current = new window.google.maps.Geocoder();
      
      if (currentLocation) {
        getAddressFromCoordinates(currentLocation.lat, currentLocation.lng);
      }
    }
  }, [mapLoaded, currentLocation]);

  // Listen for ride events
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (ride) => {
      setCurrentRide(ride);
      setShowAcceptModal(true);
      setRideStatus("requested");
    };

    const handleRideUpdate = (updatedRide) => {
      setCurrentRide(updatedRide);
    };

    const handleRideCompletion = () => {
      setRideStatus("completed");
      setTimeout(() => {
        setCurrentRide(null);
        setRideStatus("available");
        setDirections(null);
      }, 3000);
    };

    socket.on("ride:requested", handleNewRide);
    socket.on("ride:updated", handleRideUpdate);
    socket.on("ride:completed", handleRideCompletion);

    return () => {
      socket.off("ride:requested", handleNewRide);
      socket.off("ride:updated", handleRideUpdate);
      socket.off("ride:completed", handleRideCompletion);
    };
  }, [socket]);

  // Calculate route when ride or location changes
  useEffect(() => {
    if (
      !currentRide ||
      !mapLoaded ||
      !currentLocation ||
      !directionsServiceRef.current
    )
      return;

    let origin, destination;

    if (rideStatus === "accepted") {
      origin = currentLocation;
      destination = currentRide.pickup;
    } else if (rideStatus === "in_progress") {
      origin = currentLocation;
      destination = currentRide.dropoff;
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
  }, [currentRide, currentLocation, rideStatus, mapLoaded]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  const handleMapError = () => {
    console.error("Google Maps failed to load");
  };

  const calculatePrice = () => {
    if (!pickupInput || !dropoffInput || !window.google) {
      alert("Please enter both pickup and drop-off locations");
      return;
    }

    if (!directionsServiceRef.current) return;

    directionsServiceRef.current.route(
      {
        origin: pickupInput,
        destination: dropoffInput,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const distance = result.routes[0].legs[0].distance.value; // in meters
          const price = (distance * 0.002).toFixed(2); // Sri Lanka pricing (adjust as needed)
          setPriceEstimate(price);
        } else {
          console.error("Directions request failed:", status);
          setPriceEstimate(null);
        }
      }
    );
  };

  const acceptRide = () => {
    if (socket && currentRide) {
      socket.emit("ride:accept", {
        rideId: currentRide._id,
        driverLocation: currentLocation,
      });
      setRideStatus("accepted");
      setShowAcceptModal(false);
    }
  };

  const declineRide = () => {
    if (socket && currentRide) {
      socket.emit("ride:decline", { rideId: currentRide._id });
    }
    setCurrentRide(null);
    setShowAcceptModal(false);
    setRideStatus("available");
  };

  const startRide = () => {
    if (socket && currentRide) {
      socket.emit("ride:start", {
        rideId: currentRide._id,
        driverLocation: currentLocation,
      });
      setRideStatus("in_progress");
    }
  };

  const completeRide = () => {
    if (socket && currentRide) {
      socket.emit("ride:complete", {
        rideId: currentRide._id,
        endLocation: currentLocation,
      });
      setRideStatus("completed");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Driver Ride Dashboard - Sri Lanka</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-1/3 bg-white p-4 border-r border-gray-200 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Current Location
            </h2>
            {currentLocation ? (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Address:</span> {currentAddress}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Latitude:</span>{" "}
                  {currentLocation.lat.toFixed(6)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Longitude:</span>{" "}
                  {currentLocation.lng.toFixed(6)}
                </p>
                {currentLocation.accuracy && (
                  <p className="text-gray-700">
                    <span className="font-medium">Accuracy:</span>{" "}
                    {Math.round(currentLocation.accuracy)} meters
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Loading your location...</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location (Sri Lanka)
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
                Drop-off Location (Sri Lanka)
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

            {/* Price Estimate */}
            {priceEstimate && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-gray-700">
                  Estimated Price:{" "}
                  <span className="text-green-600">Rs. {priceEstimate}</span>
                </p>
              </div>
            )}

            <button
              onClick={calculatePrice}
              className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              GET PRICE ESTIMATE
            </button>
          </div>

          {/* Ride Information */}
          {currentRide && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Current Ride:{" "}
                <span className="capitalize text-blue-600">
                  {rideStatus.replace("_", " ")}
                </span>
              </h2>

              <div className="space-y-3 bg-blue-50 p-3 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">Passenger:</span>{" "}
                  {currentRide.passengerId?.name || "Guest"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Fare:</span>
                  <span className="text-green-600 font-bold">
                    {" "}
                    Rs. {currentRide.fare?.toFixed(2) || "0.00"}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Distance:</span>{" "}
                  {(currentRide.distance / 1000).toFixed(1)} km
                </p>

                {rideStatus === "accepted" && (
                  <p className="text-gray-700">
                    <span className="font-medium">Pickup:</span>{" "}
                    {currentRide.pickupLocation?.address || "Current location"}
                  </p>
                )}

                {rideStatus === "in_progress" && (
                  <p className="text-gray-700">
                    <span className="font-medium">Destination:</span>{" "}
                    {currentRide.dropoffLocation?.address || "Unknown"}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                {rideStatus === "accepted" && (
                  <button
                    onClick={startRide}
                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    Start Trip
                  </button>
                )}

                {rideStatus === "in_progress" && (
                  <button
                    onClick={completeRide}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Complete Ride
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Map */}
        <div className="w-2/3 relative">
          <LoadScript
            googleMapsApiKey="AIzaSyBzy5MB38A69NzcnngmihjBajzg0eNZsTk"
            libraries={["places", "geometry"]}
            onLoad={handleMapLoad}
            onError={handleMapError}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || defaultCenter}
              zoom={15}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                disableDefaultUI: true,
                zoomControl: true,
                gestureHandling: "greedy",
                restriction: {
                  latLngBounds: sriLankaBounds,
                  strictBounds: false
                }
              }}
              onDragEnd={() => {}}
              onZoomChanged={() => {}}
            >
              {/* Current Location Marker */}
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

              {/* Path traveled */}
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

              {/* Pickup Marker */}
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

              {/* Dropoff Marker */}
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

              {/* Directions Renderer */}
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

      {/* Ride Request Modal */}
      {showAcceptModal && currentRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                New Ride Request
              </h2>

              <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">From:</span> {currentRide.pickup}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">To:</span> {currentRide.dropoff}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Distance:</span> {(currentRide.distance / 1000).toFixed(1)} km
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Fare:</span>
                  <span className="text-green-600 font-bold">
                    {" "}
                    Rs. {currentRide.fare?.toFixed(2) || "0.00"}
                  </span>
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