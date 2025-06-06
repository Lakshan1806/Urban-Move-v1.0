import { Router } from 'express';
import {
  requestRide,
  acceptRide,
  updateDriverLocation,
  startRide,
  completeRide
} from '../controllers/driverRide.controller.js';
import { protectDriver } from '../middleware/authMiddleware.js';
import {
  validateRideRequest,
  validateRideId,
  validateDriverLocation
} from '../validations/ride.validations.js';

const router = Router();

// Passenger endpoints
router.post('/', validateRideRequest, requestRide);

// Driver endpoints
router.put('/:rideId/accept', protectDriver, validateRideId, acceptRide);
router.put('/:rideId/location', protectDriver, validateRideId, validateDriverLocation, updateDriverLocation);
router.put('/:rideId/start', protectDriver, validateRideId, startRide);
router.put('/:rideId/complete', protectDriver, validateRideId, completeRide);

export default router;