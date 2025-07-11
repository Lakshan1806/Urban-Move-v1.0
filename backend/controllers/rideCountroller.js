//live tracking implements
import Ride from '../models/RideModel.js';
import { calculateRouteProgress } from '../utils/distanceCalculations.js';
import { getRouteDetails } from '../utils/getRouteDetails.js';

// Start tracking a ride
export const startTracking = async (req, res) => {
  try {
    const { rideId } = req.body;
    
    if (!rideId) {
      return res.status(400).json({
        message: "Ride ID is required",
        status: "INVALID_REQUEST"
      });
    }

    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
        status: "NOT_FOUND"
      });
    }

    // Update ride status to in_progress
    ride.status = 'in_progress';
    ride.driverLocation = ride.startLocation; 
    await ride.save();

    res.json({
      status: "SUCCESS",
      message: "Tracking started",
      rideId: ride._id
    });
  } catch (error) {
    console.error("Start tracking error:", error);
    res.status(500).json({
      message: error.message || "Failed to start tracking",
      status: "ERROR"
    });
  }
};

// Get ride status and progress
export const getRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
        status: "NOT_FOUND"
      });
    }

    // Calculate progress if driver location is available
    let progress = 0;
    if (ride.driverLocation) {
      progress = calculateRouteProgress({
        startLocation: ride.startLocation,
        endLocation: ride.endLocation,
        driverLocation: ride.driverLocation
      });
      
      // Update ride progress
      ride.progress = progress;
      await ride.save();
    }

    res.json({
      status: "SUCCESS",
      ride: {
        _id: ride._id,
        status: ride.status,
        driverLocation: ride.driverLocation,
        progress: ride.progress,
        lastUpdated: ride.lastUpdated
      }
    });
  } catch (error) {
    console.error("Get ride status error:", error);
    res.status(500).json({
      message: error.message || "Failed to get ride status",
      status: "ERROR"
    });
  }
};

// Update driver location (simulated or from driver app)
export const updateDriverLocation = async (req, res) => {
  try {
    const { rideId, lat, lng } = req.body;
    
    if (!rideId || !lat || !lng) {
      return res.status(400).json({
        message: "Ride ID and location coordinates are required",
        status: "INVALID_REQUEST"
      });
    }

    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
        status: "NOT_FOUND"
      });
    }

    // Update driver location
    ride.driverLocation = { lat, lng };
    
    // Calculate progress
    ride.progress = calculateRouteProgress({
      startLocation: ride.startLocation,
      endLocation: ride.endLocation,
      driverLocation: ride.driverLocation
    });
    
    ride.lastUpdated = new Date();
    await ride.save();

    res.json({
      status: "SUCCESS",
      message: "Driver location updated",
      progress: ride.progress
    });
  } catch (error) {
    console.error("Update driver location error:", error);
    res.status(500).json({
      message: error.message || "Failed to update driver location",
      status: "ERROR"
    });
  }
};

// Complete a ride
export const completeRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    
    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        message: "Ride not found",
        status: "NOT_FOUND"
      });
    }

    // Mark ride as completed
    ride.status = 'completed';
    ride.progress = 100;
    ride.driverLocation = ride.endLocation;
    await ride.save();

    res.json({
      status: "SUCCESS",
      message: "Ride completed"
    });
  } catch (error) {
    console.error("Complete ride error:", error);
    res.status(500).json({
      message: error.message || "Failed to complete ride",
      status: "ERROR"
    });
  }
};

// In rideController.js - update createRide function
export const createRide = async (req, res) => {
  try {
    const { userId, pickup, dropoff, startLocation, endLocation, distance, duration, scheduledTime, steps, ridestatus, fare } = req.body;
      const routeDetails = await getRouteDetails(pickup, dropoff);
        
        const mapEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=${process.env.GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&zoom=10`;
      
        
    

    
    // Determine status based on whether scheduledTime is provided
    const status = scheduledTime ? 'scheduled' : 'pending';

    const newRide = new Ride({
      userId,
      pickup,
      dropoff,
      startLocation: routeDetails.start_location,
      endLocation: routeDetails.end_location,

      distance,
      duration,
      fare,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
      steps,
      status
    });

    const savedRide = await newRide.save();
    
    res.status(201).json({
      success: true,
      message: 'Ride created successfully',
      data: savedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create ride',
      error: error.message
    });
  }
};

// In your backend controller
export const trackRoute = async (req, res) => {
  try {
    const { pickup, dropoff, calculateOnly } = req.body;
    
    // Your existing route calculation logic here...
    const routeDetails = await calculateRoute(pickup, dropoff);
    
    // Only save to DB if calculateOnly is not true
    if (!calculateOnly) {
      const newRide = new Ride({
        // your ride creation logic
      });
      await newRide.save();
    }

    res.json({
      status: "SUCCESS",
      ...routeDetails,
      rideId: calculateOnly ? null : newRide._id
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: error.message
    });
  }
};