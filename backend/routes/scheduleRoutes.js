import express from 'express';
import { 
  scheduleRide, 
  cancelScheduledRide, 
  getScheduledRides 
} from '../controllers/scheduleController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

// Schedule a new ride
router.post('/', userAuth, scheduleRide);

// Cancel a scheduled ride
router.delete('/:rideId', userAuth, cancelScheduledRide);

// Get all scheduled rides for user
router.get('/', userAuth, getScheduledRides);

export default router;