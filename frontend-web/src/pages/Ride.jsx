import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ridecar from "../assets/Ride-pics/ridecar.svg";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
      clipRule="evenodd"
    />
  </svg>
);

function Ride() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [mapUrl, setMapUrl] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledRides, setScheduledRides] = useState([]);
  const [showScheduledRides, setShowScheduledRides] = useState(false);
  const [fare, setFare] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [rideId, setRideId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [driverAddress, setDriverAddress] = useState("");
  const [rideProgress, setRideProgress] = useState(0);

  const GOOGLE_MAPS_API_KEY = "KEY";

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const navigate = useNavigate();

  const generateMapUrl = (origin, destination, waypoint = null) => {
    let url = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}`;
    url += `&origin=${encodeURIComponent(origin)}`;
    url += `&destination=${encodeURIComponent(destination)}`;
    if (waypoint) {
      url += `&waypoints=${encodeURIComponent(waypoint)}`;
    }
    url += "&zoom=13";
    return url;
  };

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/location/reverse-geocode?lat=${lat}&lng=${lng}`,
      );
      if (response.data.status === "SUCCESS") {
        return response.data.address;
      }
      return "Address not available";
    } catch (error) {
      console.error("Error getting address:", error);
      return "Address not available";
    }
  };

  const handleReset = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    setPickup("");
    setDropoff("");
    setRouteDetails(null);
    setLoading(false);
    setError(null);
    setPickupSuggestions([]);
    setDropoffSuggestions([]);
    setMapUrl(null);
    setActiveInput(null);
    setLocationError(null);
    setShowScheduleForm(false);
    setScheduledTime(new Date());
    setFare(null);
    setRideStatus(null);
    setRideId(null);
    setDriverLocation(null);
    setDriverAddress("");
    setRideProgress(0);

    localStorage.removeItem("activeRide");
  };

  useEffect(() => {
    const loadActiveRide = async () => {
      const activeRide = localStorage.getItem("activeRide");
      if (activeRide) {
        const rideData = JSON.parse(activeRide);
        setPickup(rideData.pickup || "");
        setDropoff(rideData.dropoff || "");
        setRouteDetails(rideData.routeDetails || null);
        setMapUrl(rideData.mapUrl || null);
        setFare(rideData.fare || null);
        setRideStatus(rideData.rideStatus || null);
        setRideId(rideData.rideId || null);
        setDriverLocation(rideData.driverLocation || null);
        setRideProgress(rideData.rideProgress || 0);

        if (rideData.driverLocation) {
          const address = await getAddressFromCoordinates(
            rideData.driverLocation.lat,
            rideData.driverLocation.lng,
          );
          setDriverAddress(address);
        }

        if (rideData.rideId && rideData.rideStatus === "searching") {
          startRidePolling(rideData.rideId);
        }
      }
    };

    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          permissionStatus.onchange = () => {
            console.log(
              "Geolocation permission changed to:",
              permissionStatus.state,
            );
          };
        });
    }

    loadActiveRide();
    fetchScheduledRides();

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (rideId || rideStatus || routeDetails || driverLocation) {
      const activeRide = {
        pickup,
        dropoff,
        routeDetails,
        mapUrl,
        fare,
        rideStatus,
        rideId,
        driverLocation,
        rideProgress,
      };
      localStorage.setItem("activeRide", JSON.stringify(activeRide));
    }
  }, [
    pickup,
    dropoff,
    routeDetails,
    mapUrl,
    fare,
    rideStatus,
    rideId,
    driverLocation,
    rideProgress,
  ]);

  useEffect(() => {
    if (routeDetails) {
      if (driverLocation) {
        const url = generateMapUrl(
          `${driverLocation.lat},${driverLocation.lng}`,
          dropoff,
          pickup,
        );
        setMapUrl(url);
      } else {
        const url = generateMapUrl(pickup, dropoff);
        setMapUrl(url);
      }
    }
  }, [driverLocation, routeDetails, pickup, dropoff]);

  const fetchScheduledRides = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/schedule", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.status === "SUCCESS") {
        setScheduledRides(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching scheduled rides:", err);
    }
  };

  const fetchSuggestions = async (input, isPickup) => {
    if (input.length < 2) {
      isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
      return;
    }

    setIsFetchingSuggestions(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/location/autocomplete?input=${encodeURIComponent(input)}`,
      );

      if (response.data.suggestions) {
        isPickup
          ? setPickupSuggestions(response.data.suggestions)
          : setDropoffSuggestions(response.data.suggestions);
      }
    } catch (err) {
      console.error("Autocomplete error:", err);
      isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeInput === "pickup" && pickup) {
        fetchSuggestions(pickup, true);
      } else if (activeInput === "dropoff" && dropoff) {
        fetchSuggestions(dropoff, false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pickup, dropoff, activeInput]);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage;
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage =
                  "Location access was denied. Please enable permissions in your browser settings.";
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
          },
        );
      });

      const { latitude, longitude } = position.coords;
      const response = await axios.get(
        `http://localhost:5000/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`,
      );

      if (response.data.status === "SUCCESS") {
        setPickup(response.data.address);
        setPickupSuggestions([]);
      } else {
        throw new Error(response.data.message || "Failed to get address");
      }
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(error.message || "Failed to get your location");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSuggestionClick = (suggestion, isPickup) => {
    isPickup
      ? setPickup(suggestion.description)
      : setDropoff(suggestion.description);
    isPickup ? setPickupSuggestions([]) : setDropoffSuggestions([]);
    setActiveInput(null);
  };

  const handleInputFocus = (inputType) => {
    setActiveInput(inputType);
    if (inputType === "pickup" && pickup.length >= 2) {
      fetchSuggestions(pickup, true);
    } else if (inputType === "dropoff" && dropoff.length >= 2) {
      fetchSuggestions(dropoff, false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup.trim() || !dropoff.trim()) {
      setError("Please enter both pickup and dropoff locations");
      return;
    }

    setLoading(true);
    setError(null);
    setRouteDetails(null);
    setMapUrl(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/location/track",
        {
          pickup: pickup.trim(),
          dropoff: dropoff.trim(),
        },
      );

      if (response.data.status === "SUCCESS") {
        setRouteDetails(response.data);
        const newMapUrl = generateMapUrl(pickup, dropoff);
        setMapUrl(newMapUrl);
        const distanceKm = parseFloat(response.data.distance.split(" ")[0]);
        const calculatedFare = Math.round(distanceKm * 68);
        setFare(calculatedFare);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch route details",
        );
      }
    } catch (err) {
      console.error("Route calculation error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to calculate route",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleRide = async () => {
    if (!pickup.trim() || !dropoff.trim()) {
      setError("Please enter both pickup and dropoff locations");
      return;
    }

    if (scheduledTime <= new Date()) {
      setError("Please select a future time for scheduling");
      return;
    }

    setIsScheduling(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/schedule",
        {
          pickup: pickup.trim(),
          dropoff: dropoff.trim(),
          scheduledTime: scheduledTime.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.status === "SUCCESS") {
        alert("Ride scheduled successfully!");
        setShowScheduleForm(false);
        fetchScheduledRides();
      } else {
        throw new Error(response.data.message || "Failed to schedule ride");
      }
    } catch (err) {
      console.error("Scheduling error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to schedule ride",
      );
    } finally {
      setIsScheduling(false);
    }
  };

  const startRidePolling = (rideId) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rideRoute/status/${rideId}`,
        );

        if (response.data?.status === "SUCCESS") {
          const rideData = response.data.ride;
          setRideStatus(rideData.status);

          if (rideData.status === "accepted") {
            setDriverLocation(rideData.driverLocation);
            setRideProgress(rideData.progress);

            const address = await getAddressFromCoordinates(
              rideData.driverLocation.lat,
              rideData.driverLocation.lng,
            );
            setDriverAddress(address);
          } else if (
            rideData.status === "cancelled" ||
            rideData.status === "completed"
          ) {
            clearInterval(interval);
            setPollingInterval(null);
            handleCancelTrip();
          }
        }
      } catch (err) {
        console.error("Error polling ride status:", err);
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 3000);

    setPollingInterval(interval);
  };

  const handleStartRide = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!routeDetails) {
        throw new Error("Route details are missing");
      }

      const distanceKm = routeDetails
        ? parseFloat(routeDetails.distance.split(" ")[0])
        : 0;
      const calculatedFare = Math.round(distanceKm * 68);

      const response = await axios.post("http://localhost:5000/api/rideRoute", {
        userId: "",
        pickup,
        dropoff,
        startLocation: routeDetails?.start_location || { lat: 0, lng: 0 },
        endLocation: routeDetails?.end_location || { lat: 0, lng: 0 },
        distance: routeDetails?.distance || "0 km",
        duration: routeDetails?.duration || "0 mins",
        fare: calculatedFare,
        status: "searching",
        scheduledTime: showScheduleForm ? scheduledTime.toISOString() : null,
        steps: routeDetails.steps,
      });

      if (response.data?.success) {
        setRideId(response.data.data._id);
        setRideStatus("searching");
        startRidePolling(response.data.data._id);
      } else {
        throw new Error(response.data?.message || "Failed to create ride");
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to start ride",
      );
    }
  };

  const handleCancelTrip = async () => {
    try {
      if (rideId) {
        await axios.post(
          `http://localhost:5000/api/rideRoute/cancel/${rideId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      }
    } catch (err) {
      console.error("Error cancelling ride:", err);
    } finally {
      handleReset();
    }
  };

  const cancelScheduledRide = async (rideId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/schedule/${rideId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.status === "SUCCESS") {
        alert("Ride cancelled successfully");
        fetchScheduledRides();
      } else {
        throw new Error(response.data.message || "Failed to cancel ride");
      }
    } catch (err) {
      console.error("Error cancelling ride:", err);
      alert(err.response?.data?.message || "Failed to cancel ride");
    }
  };

  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden bg-white">
      <div className="flex flex-col items-start justify-center gap-8 px-4 py-8 md:px-8 lg:flex-row">
        <div className="w-full max-w-xl lg:w-1/2">
          <h1 className="mb-6 bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl">
            Request a ride for immediate pickup or schedule one for later
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border-2 border-[#FF7C1D] bg-black p-6 shadow-xl md:p-8"
          >
            {rideStatus === "accepted" && driverLocation && (
              <div className="rounded-lg bg-green-100 p-4">
                <h3 className="mb-2 text-lg font-medium text-green-800">
                  Driver is on the way!
                </h3>
                <p className="text-green-700">
                  Your driver has accepted the ride and is currently at:
                  <br />
                  <strong>Location:</strong> {driverAddress}
                  <br />
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative space-y-2" ref={pickupRef}>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-medium text-[#FF7C1D]">
                    <MapPinIcon />
                    Pickup Location
                  </label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation || loading}
                    className="flex items-center gap-1 text-sm text-[#FFD12E] transition-colors hover:text-[#FF7C1D] disabled:opacity-50"
                  >
                    {isGettingLocation ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Locating...
                      </>
                    ) : (
                      <>
                        <LocationIcon />
                        Use Current Location
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  onFocus={() => handleInputFocus("pickup")}
                  className="w-full rounded-lg bg-gray-100 p-3 outline-none focus:ring-2 focus:ring-[#FF7C1D]"
                  placeholder=""
                  disabled={loading || rideStatus === "searching"}
                />

                {isFetchingSuggestions && activeInput === "pickup" && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="p-3 text-gray-500">
                      Searching locations...
                    </div>
                  </div>
                )}
                {pickupSuggestions.length > 0 &&
                  activeInput === "pickup" &&
                  !isFetchingSuggestions && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {pickupSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="cursor-pointer border-b border-gray-100 p-3 hover:bg-gray-100"
                          onClick={() =>
                            handleSuggestionClick(suggestion, true)
                          }
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="relative space-y-2" ref={dropoffRef}>
                <label className="flex items-center gap-2 font-medium text-[#FF7C1D]">
                  <MapPinIcon />
                  Drop-off Location
                </label>
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  onFocus={() => handleInputFocus("dropoff")}
                  className="w-full rounded-lg bg-gray-100 p-3 outline-none focus:ring-2 focus:ring-[#FF7C1D]"
                  placeholder=""
                  disabled={loading || rideStatus === "searching"}
                />

                {isFetchingSuggestions && activeInput === "dropoff" && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="p-3 text-gray-500">
                      Searching locations...
                    </div>
                  </div>
                )}
                {dropoffSuggestions.length > 0 &&
                  activeInput === "dropoff" &&
                  !isFetchingSuggestions && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {dropoffSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="cursor-pointer border-b border-gray-100 p-3 hover:bg-gray-100"
                          onClick={() =>
                            handleSuggestionClick(suggestion, false)
                          }
                        >
                          {suggestion.description}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {showScheduleForm && (
              <div className="space-y-4 rounded-lg bg-black p-4">
                <h3 className="text-lg font-medium text-[#FFD12E]">
                  Schedule Your Ride
                </h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Date & Time
                  </label>
                  <DatePicker
                    selected={scheduledTime}
                    onChange={(date) => setScheduledTime(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleScheduleRide}
                    disabled={isScheduling}
                    className="rounded bg-[#FF7C1D] px-4 py-2 text-white hover:bg-[#FF6C1D] disabled:opacity-50"
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-100 p-3 text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {locationError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-100 p-3 text-red-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Location Error</p>
                  <p className="text-sm">{locationError}</p>
                </div>
              </div>
            )}

            {routeDetails && (
              <div className="space-y-2 rounded-lg bg-gray-800 p-4">
                <div className="flex items-center gap-2 text-[#FFD12E]">
                  <ClockIcon />
                  <p className="font-medium">{routeDetails.duration}</p>
                </div>
                <div className="flex flex-col gap-1 text-gray-200">
                  <p className="flex items-center gap-2">
                    <span className="text-[#FF7C1D]">From:</span>
                    {routeDetails.start_address}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-[#FF7C1D]">To:</span>
                    {routeDetails.end_address}
                  </p>
                  <p className="mt-2 text-lg font-medium text-[#FFD12E]">
                    Distance: {routeDetails.distance}
                  </p>
                  {fare && (
                    <p className="mt-1 text-xl font-bold text-white">
                      Estimated Fare: Rs. {fare}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center gap-4 md:flex-row">
              {!routeDetails ? (
                <>
                  <button
                    type="submit"
                    disabled={loading || rideStatus === "searching"}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] px-6 py-3 font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="mr-3 h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      "GET PRICE"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(!showScheduleForm)}
                    className="flex-1 rounded-full border-2 border-[#ad9481] px-6 py-3 font-medium text-[#FF7C1D] transition-colors hover:bg-[#FF7C1D]/10"
                    disabled={loading || rideStatus === "searching"}
                  >
                    {showScheduleForm ? "CANCEL SCHEDULE" : "SCHEDULE LATER"}
                  </button>
                </>
              ) : (
                <>
                  {rideStatus === "searching" ? (
                    <button
                      type="button"
                      disabled
                      className="flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-3 font-medium text-white"
                    >
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      SEARCHING FOR DRIVERS...
                    </button>
                  ) : rideStatus === "accepted" ? (
                    <button
                      type="button"
                      disabled
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-medium text-white"
                    >
                      DRIVER ON THE WAY
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartRide}
                      disabled={rideStatus === "searching"}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] px-6 py-3 font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      START RIDE
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCancelTrip}
                    className="flex-1 rounded-full bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
                  >
                    CANCEL TRIP
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => setShowScheduledRides(!showScheduledRides)}
              className="w-full rounded-lg bg-black py-2 text-[#FFD12E] transition-colors hover:bg-black"
            >
              {showScheduledRides ? "Hide" : "View"} Scheduled Rides
            </button>

            {showScheduledRides && (
              <div className="mt-4 rounded-lg bg-black p-4">
                <h3 className="mb-3 text-lg font-medium text-[#FFD12E]">
                  Your Scheduled Rides
                </h3>
                {scheduledRides.length === 0 ? (
                  <p className="text-gray-400">No scheduled rides found</p>
                ) : (
                  <ul className="space-y-3">
                    {scheduledRides.map((ride) => (
                      <li
                        key={ride._id}
                        className="flex items-center justify-between rounded-lg bg-gray-700 p-3"
                      >
                        <div>
                          <p className="text-[#FF7C1D]">
                            {new Date(ride.scheduledTime).toLocaleString()}
                          </p>
                          <p className="text-gray-300">
                            {ride.pickup} → {ride.dropoff}
                          </p>
                        </div>
                        <button
                          onClick={() => cancelScheduledRide(ride._id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-1 rounded-lg bg-black p-2">
              <button
                type="button"
                onClick={handleReset}
                className="py-1/2 w-full rounded-lg bg-black text-[#FFD12E] transition-colors hover:bg-black"
              >
                Finish Trip
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center justify-center lg:mt-0 lg:w-1/2">
          <div className="flex h-full w-full items-center justify-center">
            <img
              src={ridecar}
              alt="Ride illustration"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>

      <div className="w-full px-4 pb-8">
        <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-md">
          {loading && (
            <div className="bg-opacity-50 absolute inset-0 z-10 flex items-center justify-center bg-black">
              <div className="flex items-center gap-2 text-lg text-white">
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading map...
              </div>
            </div>
          )}
          {mapUrl ? (
            <div className="relative h-full w-full">
              <iframe
                title="Route Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
                onError={() =>
                  setError("Failed to load map. Please try again.")
                }
              />
              {rideStatus === "accepted" && driverLocation && (
                <div className="absolute bottom-4 left-4 rounded-lg bg-white p-3 shadow-md">
                  <p className="font-medium">Driver Location</p>
                  <p>
                    <strong>Address:</strong> {driverAddress}
                  </p>
                  <p>
                    <strong>Coordinates:</strong>{" "}
                    {driverLocation.lat.toFixed(4)},{" "}
                    {driverLocation.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              {loading || isGettingLocation ? (
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="h-8 w-8 animate-spin text-[#FF7C1D]"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-gray-500">
                    Enter locations to see the route map
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ride;
