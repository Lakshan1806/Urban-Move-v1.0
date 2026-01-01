import DriverRide from '../models/DriverRideModel.js';
import { calculateRoute } from '../services/maps.service.js';
import { notifyNearbyDrivers, notifyPassenger } from '../services/notification.service.js';

const calculateFare = (distance) => {
  const baseFare = 100; // LKR 100 base fare
  const perMeterRate = 0.2; // LKR 0.20 per meter
  return baseFare + (distance * perMeterRate);
};

export const requestRide = async (req, res) => {
  try {
    const { passengerId, pickupLocation, dropoffLocation } = req.body;
    
    const routeInfo = await calculateRoute(
      pickupLocation.coordinates, 
      dropoffLocation.coordinates
    );

    const ride = new DriverRide({
      passengerId,
      pickupLocation,
      dropoffLocation,
      fare: calculateFare(routeInfo.distance),
      distance: routeInfo.distance,
      duration: routeInfo.duration,
      route: routeInfo.route,
      status: 'requested'
    });

    await ride.save();
    notifyNearbyDrivers(ride);

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { driverId, driverLocation } = req.body;

    const ride = await DriverRide.findByIdAndUpdate(
      rideId,
      {
        driverId,
        driverLocation: {
          coordinates: driverLocation,
          timestamp: new Date()
        },
        status: 'accepted',
        updatedAt: new Date()
      },
      { new: true }
    );

    const routeToPickup = await calculateRoute(
      driverLocation,
      ride.pickupLocation.coordinates
    );

    notifyPassenger(ride.passengerId, 'ride:accepted', {
      ride,
      driverLocation,
      routeToPickup
    });

    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateDriverLocation = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { location } = req.body;

    const ride = await DriverRide.findByIdAndUpdate(
      rideId,
      {
        driverLocation: {
          coordinates: location,
          timestamp: new Date()
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (ride.status === 'accepted' || ride.status === 'in_progress') {
      notifyPassenger(ride.passengerId, 'driver:location', {
        rideId,
        location
      });
    }

    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const startRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await DriverRide.findByIdAndUpdate(
      rideId,
      {
        status: 'in_progress',
        updatedAt: new Date()
      },
      { new: true }
    );

    notifyPassenger(ride.passengerId, 'ride:started', ride);
    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const completeRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { endLocation } = req.body;

    const ride = await DriverRide.findByIdAndUpdate(
      rideId,
      {
        status: 'completed',
        updatedAt: new Date(),
        driverLocation: {
          coordinates: endLocation,
          timestamp: new Date()
        }
      },
      { new: true }
    );

    notifyPassenger(ride.passengerId, 'ride:completed', ride);
    res.json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};