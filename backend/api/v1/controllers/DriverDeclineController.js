import Ride from '../models/DriverRideModel.js';

export const declineRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rejectNote, driverLocation } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required'
      });
    }

    const updatedRide = await Ride.findByIdAndUpdate(
      rideId,
      {
        status: 'declined',
        rejectNote,
        driverLocation: {
          lat: driverLocation.lat,
          lng: driverLocation.lng,
          timestamp: new Date()
        },
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
      message: 'Ride declined successfully',
      ride: updatedRide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error declining ride',
      error: error.message
    });
  }
};