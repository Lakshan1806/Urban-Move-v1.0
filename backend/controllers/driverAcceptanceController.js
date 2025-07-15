import DriverAcceptance from '../models/DriverAcceptance.js';

export const acceptRide = async (req, res) => {
  try {
    const driverId = req.user.driverId;
    const { rideId, driverName, currentLocation, pickupLocation } = req.body;

    const existing = await DriverAcceptance.findOne({ rideId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ride already accepted by a driver'
      });
    }

    const acceptance = new DriverAcceptance({
      rideId,
      driverId,
      driverName,
      currentLocation,
      pickupLocation,
      status: 'accepted'
    });

    await acceptance.save();

    if (req.io) {
      req.io.to(rideId).emit('driver:accepted', {
        rideId,
        driverId,
        driverName,
        currentLocation,
        pickupLocation,
        status: 'accepted'
      });
    }

    res.status(201).json({
      success: true,
      data: acceptance
    });
  } catch (error) {
    console.error('Error accepting ride:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept ride'
    });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    const { rideId, driverId, location } = req.body;

    const updated = await DriverAcceptance.findOneAndUpdate(
      { rideId, driverId },
      {
        $set: {
          'currentLocation.lat': location.lat,
          'currentLocation.lng': location.lng,
          'currentLocation.address': location.address,
          updatedAt: Date.now()
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Ride acceptance not found'
      });
    }

    if (req.io) {
      req.io.to(rideId).emit('driver:location', {
        rideId,
        location: updated.currentLocation
      });
    }

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update driver location'
    });
  }
};

export const getDriverAcceptance = async (req, res) => {
  try {
    const { rideId } = req.params;

    const acceptance = await DriverAcceptance.findOne({ rideId });
    if (!acceptance) {
      return res.status(404).json({
        success: false,
        message: 'No driver has accepted this ride yet'
      });
    }

    res.status(200).json({
      success: true,
      data: acceptance
    });
  } catch (error) {
    console.error('Error getting driver acceptance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver acceptance'
    });
  }
};
