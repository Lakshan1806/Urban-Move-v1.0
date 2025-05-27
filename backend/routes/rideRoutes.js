import express from 'express';
import rideController from '../controllers/rideController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

// Create a new ride
router.post('/', userAuth, rideController.createRide);

// Get all rides for a user
router.get('/user/:userId', userAuth, rideController.getUserRides);

// Get ride by ID
router.get('/:rideId', userAuth, rideController.getRideById);

// Update ride status
router.put('/:rideId/status', userAuth, rideController.updateRideStatus);

// Update driver location
router.put('/:rideId/location', userAuth, rideController.updateDriverLocation);

// Cancel a ride
router.delete('/:rideId', userAuth, rideController.cancelRide);

// Get active rides
router.get('/active', userAuth, rideController.getActiveRides);

// Get scheduled rides
router.get('/scheduled', userAuth, rideController.getScheduledRides);

// Start tracking
router.post('/start-tracking', userAuth, rideController.startTracking);

// Complete a ride
router.put('/:rideId/complete', userAuth, rideController.completeRide);

// Get ride status
router.get('/:rideId/status', userAuth, rideController.getRideStatus);

export default router;