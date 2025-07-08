// routes/DriverfetchRoute.js
import express from 'express';
import {
  getLatestPickupLocation,
  getLatestDropoffLocation,
  getLatestRideDetails
} from '../controllers/DriverfetchController.js';

const router = express.Router();

router.get('/pickup/:userId', getLatestPickupLocation);
router.get('/dropoff/:userId', getLatestDropoffLocation);
router.get('/details/:userId', getLatestRideDetails);

export default router;