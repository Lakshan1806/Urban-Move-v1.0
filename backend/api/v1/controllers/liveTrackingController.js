import DriverRide from '../models/DriverRideModel.js';

export const saveLiveLocation = async (req, res) => {
  try {
    const { rideId, lat, lng, address, status } = req.body;

    // Enhanced validation
    if (!rideId || isNaN(lat) || isNaN(lng) || !['to_pickup', 'to_dropoff'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        details: {
          rideId: !rideId ? 'Missing rideId' : undefined,
          lat: isNaN(lat) ? 'Invalid latitude' : undefined,
          lng: isNaN(lng) ? 'Invalid longitude' : undefined,
          status: !['to_pickup', 'to_dropoff'].includes(status) ? 'Invalid status' : undefined
        }
      });
    }

    const ride = await DriverRide.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    const newLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address: address || 'Unknown location',
      status,
      timestamp: new Date()
    };

    // Update the ride document
    const updatedRide = await DriverRide.findByIdAndUpdate(
      rideId,
      {
        $push: {
          liveTrackingLocations: {
            $each: [newLocation],
            $slice: -500 // Keep last 500 locations
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Location saved successfully',
      data: newLocation
    });

  } catch (error) {
    console.error('Error saving live location:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while saving location',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getLiveTrackingLocations = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required'
      });
    }

    const ride = await DriverRide.findById(rideId)
      .select('liveTrackingLocations')
      .lean();

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ride.liveTrackingLocations || []
    });

  } catch (error) {
    console.error('Error fetching live locations:', {
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching locations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const clearLiveTracking = async (req, res) => {
  try {
    const { rideId } = req.params;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required'
      });
    }

    const result = await DriverRide.findByIdAndUpdate(
      rideId,
      { $set: { liveTrackingLocations: [] } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Live tracking data cleared successfully'
    });

  } catch (error) {
    console.error('Error clearing live tracking:', {
      error: error.message,
      stack: error.stack,
      params: req.params
    });
    
    res.status(500).json({
      success: false,
      message: 'Internal server error while clearing tracking data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};