const DriverFinishTrip = require('../models/DriverFinishTripModel');

exports.saveDriverRide = async (req, res) => {
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
      route
    } = req.body;

    // Validate required fields
    if (!rideId || !driverId || !pickup || !dropoff || !startLocation || !endLocation) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields'
      });
    }

    const newRide = new DriverFinishTrip({
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
      status: 'completed',
      route
    });

    await newRide.save();

    res.status(201).json({
      success: true,
      message: 'Ride completed and saved successfully',
      data: newRide
    });

  } catch (error) {
    console.error('Error saving completed trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save completed trip',
      error: error.message
    });
  }
};

exports.getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const rides = await DriverFinishTrip.find({ driverId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      data: rides
    });

  } catch (error) {
    console.error('Error fetching driver completed trips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch completed trips',
      error: error.message
    });
  }
};