import Ride from '../models/RideModel.js';

export const getLatestPickupLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const ride = await Ride.findOne({ userId }).sort({ createdAt: -1 });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'No ride found for this user'
      });
    }

    res.status(200).json({
      success: true,
      pickup: ride.pickup
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pickup location',
      error: error.message
    });
  }
};

export const getLatestDropoffLocation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const ride = await Ride.findOne({ userId }).sort({ createdAt: -1 });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'No ride found for this user'
      });
    }

    res.status(200).json({
      success: true,
      dropoff: ride.dropoff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching drop-off location',
      error: error.message
    });
  }
};

export const getLatestRideDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const ride = await Ride.findOne({ userId }).sort({ createdAt: -1 });

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'No ride found for this user'
      });
    }

    res.status(200).json({
      success: true,
      rideDetails: {
        distance: ride.distance,
        duration: ride.duration,
        fare: ride.fare,
        status: ride.status,
        scheduleTime: ride.scheduledTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ride details',
      error: error.message
    });
  }
};



