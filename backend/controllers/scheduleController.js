import Ride from '../models/RideModel.js';
import { getRouteDetails } from '../utils/getRouteDetails.js';
import { calculateFare } from '../utils/distanceCalculations.js';

export const scheduleRide = async (req, res) => {
  try {
    const { pickup, dropoff, scheduledTime } = req.body;
    const userId = req.user.id;

    if (!pickup || !dropoff || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Pickup, dropoff and scheduled time are required',
        status: 'INVALID_REQUEST'
      });
    }

    // Get route details from Google Maps API
    const routeDetails = await getRouteDetails(pickup, dropoff);
    
    // Calculate fare
    const fare = calculateFare(routeDetails.distance);

    // Create new scheduled ride
    const newRide = new Ride({
      userId,
      pickup,
      dropoff,
      startLocation: routeDetails.start_location,
      endLocation: routeDetails.end_location,
      distance: routeDetails.distance,
      duration: routeDetails.duration,
      fare,
      status: 'scheduled',
      scheduledTime: new Date(scheduledTime),
      steps: routeDetails.steps.map(step => ({
        travel_mode: step.travel_mode,
        instructions: step.html_instructions,
        distance: step.distance,
        duration: step.duration,
        polyline: typeof step.polyline === 'string' ? step.polyline : step.polyline.points
      }))
    });

    const savedRide = await newRide.save();

    res.status(201).json({
      success: true,
      message: 'Ride scheduled successfully',
      data: savedRide,
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Error scheduling ride:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to schedule ride',
      status: 'ERROR'
    });
  }
};

export const cancelScheduledRide = async (req, res) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);
    
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found',
        status: 'NOT_FOUND'
      });
    }

    if (ride.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Only scheduled rides can be cancelled',
        status: 'INVALID_REQUEST'
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Scheduled ride cancelled successfully',
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Error cancelling scheduled ride:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel scheduled ride',
      status: 'ERROR'
    });
  }
};

export const getScheduledRides = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const scheduledRides = await Ride.find({
      userId,
      status: 'scheduled',
      scheduledTime: { $gte: new Date() }
    }).sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      data: scheduledRides,
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Error fetching scheduled rides:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch scheduled rides',
      status: 'ERROR'
    });
  }
};