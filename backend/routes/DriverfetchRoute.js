// routes/DriverfetchRoute.js
import express from 'express';
import {
  getLatestPickupLocation,
  getLatestDropoffLocation,
  getLatestRideDetails
} from '../controllers/DriverfetchController.js';

const router = express.Router();

router.get('/pickup', getLatestPickupLocation);
router.get('/dropoff', getLatestDropoffLocation);
router.get('/details', getLatestRideDetails);

export default router;