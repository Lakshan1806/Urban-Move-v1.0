import DriverRide from '../models/DriverRideModel.js';

export const saveRide = async (req, res) => {
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

    // Validate required fields
    if (!rideId || !driverId || !userId || !pickup || !dropoff || fare === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const newRide = new DriverRide({
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
      status: status || 'completed',
      route
    });

    const savedRide = await newRide.save();

    res.status(201).json({
      success: true,
      message: 'Ride saved successfully',
      data: savedRide
    });
  } catch (error) {
    console.error('Error saving ride:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving ride',
      error: error.message
    });
  }
};

export const getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;
    const rides = await DriverRide.find({ driverId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rides',
      error: error.message
    });
  }
};