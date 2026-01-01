import Ride from '../models/RideModel.js';
import mongoose from 'mongoose';

// Assign driver to ride
export const assignDriver = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { driverId } = req.body;
    
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

    if (ride.status !== 'pending' && ride.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: `Cannot assign driver to ride with status ${ride.status}`
      });
    }

    ride.driverId = driverId;
    ride.driverAssigned = true;
    ride.driverLocation = ride.startLocation; // Start at pickup point
    ride.status = 'driver_assigned';
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign driver',
      error: error.message
    });
  }
};

// Update driver's current location
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

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { 
        driverLocation: { lat, lng },
        lastUpdated: new Date() 
      },
      { new: true }
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver location updated successfully',
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update driver location',
      error: error.message
    });
  }
};

// Get rides assigned to driver
export const getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver ID'
      });
    }

    const rides = await Ride.find({ 
      driverId,
      status: { $in: ['driver_assigned', 'in_progress'] }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver rides',
      error: error.message
    });
  }
};

export default {
  assignDriver,
  updateDriverLocation,
  getDriverRides
};