import axios from 'axios';
import { getRouteDetails } from '../utils/getRouteDetails.js';
import Ride from '../models/RideModel.js';
import { calculateFare } from '../utils/distanceCalculations.js';

export const autocomplete = async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 2) {
    return res.status(400).json({ 
      message: "Input must be at least 2 characters long",
      status: "INVALID_REQUEST"
    });
  }
  
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:lk`;

    const response = await axios.get(autocompleteUrl);
    const data = response.data;

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(data.error_message || "Failed to fetch suggestions");
    }

    const suggestions = data.predictions.map(prediction => ({
      description: prediction.description,
      place_id: prediction.place_id
    }));

    res.json({
      suggestions,
      status: data.status
    });
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to get autocomplete suggestions",
      status: "ERROR"
    });
  }
};

export const reverseGeocode = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ 
      message: "Latitude and longitude are required",
      status: "INVALID_REQUEST"
    });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    const response = await axios.get(geocodeUrl);
    const data = response.data;

    if (data.status !== "OK") {
      throw new Error(data.error_message || "Failed to fetch address details");
    }

    if (!data.results.length) {
      throw new Error("No address found for these coordinates");
    }

    res.json({
      address: data.results[0].formatted_address,
      status: "SUCCESS"
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to get address from coordinates",
      status: "ERROR"
    });
  }
};

export const trackRoute = async (req, res) => {
  const { pickup, dropoff } = req.body;
  
  if (!pickup || !dropoff) {
    return res.status(400).json({ 
      message: "Pickup and dropoff locations are required",
      status: "INVALID_REQUEST"
    });
  }

  try {
    const routeDetails = await getRouteDetails(pickup, dropoff);
    
    const mapEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=${process.env.GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&zoom=10`;
  
    const fare = calculateFare(routeDetails.distance);

    const newRide = new Ride({
      userId: req.user.id,
      pickup,
      dropoff,
      startLocation: routeDetails.start_location,
      endLocation: routeDetails.end_location,
      driverLocation: routeDetails.start_location,
      distance: routeDetails.distance,
      duration: routeDetails.duration,
      fare,
      status: 'pending',
      steps: routeDetails.steps.map(step => ({
        travel_mode: step.travel_mode,
        instructions: step.html_instructions,
        distance: step.distance,
        duration: step.duration,
        polyline: typeof step.polyline === 'string' ? step.polyline : step.polyline.points
      })),
      lastUpdated: new Date()
    });

    const savedRide = await newRide.save();

    res.json({
      rideId: savedRide._id,
      distance: routeDetails.distance,
      duration: routeDetails.duration,
      start_address: routeDetails.start_address,
      end_address: routeDetails.end_address,
      map_embed_url: mapEmbedUrl,
      fare,
      status: "SUCCESS"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: error.message || "Failed to get route details",
      status: "ERROR"
    });
  }
};