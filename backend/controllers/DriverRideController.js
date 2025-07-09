// controllers/DriverRideController.js
import DriverRide from '../models/DriverRideModel.js';

export const saveRideHistory = async (req, res) => {
  try {
    const {
      rideId,
      driverId,
      userId,
      pickup,
      dropoff,
      startLocation,
      endLocation,
      driverLocationUpdates,
      distance,
      duration,
      fare,
      driverEarnings,
      status,
      route
    } = req.body;

    const newRideHistory = new DriverRide({
      rideId,
      driverId,
      userId,
      pickup,
      dropoff,
      startLocation,
      endLocation,
      driverLocationUpdates,
      distance,
      duration,
      fare,
      driverEarnings,
      status,
      route,
      actualDropoffTime: status === 'completed' ? new Date() : null
    });

    await newRideHistory.save();

    res.status(201).json({
      success: true,
      message: 'Ride history saved successfully',
      data: newRideHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving ride history',
      error: error.message
    });
  }
};

export const getDriverRideHistory = async (req, res) => {
  try {
    const { driverId } = req.params;

    const rides = await DriverRide.find({ driverId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ride history',
      error: error.message
    });
  }
};