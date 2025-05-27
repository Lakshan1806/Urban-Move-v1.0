import Ride from '../models/RideModel.js';
import mongoose from 'mongoose';
import { getDistanceFromLatLonInKm } from '../utils/distanceCalculations.js';

// Create a new ride
export const createRide = async (req, res) => {
  try {
    const { userId, pickup, dropoff, startLocation, endLocation, distance, duration, scheduledTime, steps, ridestatus, fare } = req.body;
    
    const newRide = new Ride({
      userId,
      pickup,
      dropoff,
      startLocation,
      endLocation,
      distance,
      duration,
      fare,
      scheduledTime,
      steps,
      status: scheduledTime ? 'scheduled' : 'pending'
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

// Get all rides for a user
export const getUserRides = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const rides = await Ride.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user rides',
      error: error.message
    });
  }
};

// Get ride by ID
export const getRideById = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId).lean();

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ride',
      error: error.message
    });
  }
};

// Update ride status
export const updateRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled', 'scheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { 
        status,
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      data: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update ride status',
      error: error.message
    });
  }
};

// Update driver location
export const updateDriverLocation = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { lat, lng } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { 
        driverLocation: { lat, lng },
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver location updated successfully',
      data: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update driver location',
      error: error.message
    });
  }
};

// Cancel a ride
export const cancelRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Ride is already ${ride.status} and cannot be cancelled`
      });
    }

    ride.status = 'cancelled';
    ride.lastUpdated = new Date();
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride',
      error: error.message
    });
  }
};

// Get active rides
export const getActiveRides = async (req, res) => {
  try {
    const activeRides = await Ride.find({
      status: { $in: ['pending', 'in_progress'] }
    }).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      data: activeRides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active rides',
      error: error.message
    });
  }
};

// Get scheduled rides
export const getScheduledRides = async (req, res) => {
  try {
    const scheduledRides = await Ride.find({
      status: 'scheduled',
      scheduledTime: { $gte: new Date() }
    }).sort({ scheduledTime: 1 }).lean();

    res.status(200).json({
      success: true,
      data: scheduledRides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheduled rides',
      error: error.message
    });
  }
};

// Complete a ride
export const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Ride is already completed'
      });
    }

    if (ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled ride cannot be completed'
      });
    }

    ride.status = 'completed';
    ride.lastUpdated = new Date();
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully',
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete ride',
      error: error.message
    });
  }
};

// Start tracking
export const startTracking = async (req, res) => {
  try {
    const { rideId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (!['pending', 'scheduled'].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot start tracking for ride with status ${ride.status}`
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      { 
        status: 'in_progress',
        driverLocation: ride.startLocation,
        lastUpdated: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Live tracking started successfully',
      data: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start tracking',
      error: error.message
    });
  }
};

// Get ride status
export const getRideStatus = async (req, res) => {
  try {
    const { rideId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ride ID'
      });
    }

    const ride = await Ride.findById(rideId).lean();
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    let progress = 0;
    if (ride.driverLocation && ride.startLocation && ride.endLocation) {
      const totalDistance = getDistanceFromLatLonInKm(
        ride.startLocation.lat,
        ride.startLocation.lng,
        ride.endLocation.lat,
        ride.endLocation.lng
      );
      
      const completedDistance = getDistanceFromLatLonInKm(
        ride.startLocation.lat,
        ride.startLocation.lng,
        ride.driverLocation.lat,
        ride.driverLocation.lng
      );
      
      progress = Math.min(100, Math.max(0, (completedDistance / totalDistance) * 100));
    }

    res.status(200).json({
      success: true,
      data: {
        ...ride,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get ride status',
      error: error.message
    });
  }
};

export default {
  createRide,
  getUserRides,
  getRideById,
  updateRideStatus,
  updateDriverLocation,
  cancelRide,
  getActiveRides,
  getScheduledRides,
  startTracking,
  completeRide,
  getRideStatus
};