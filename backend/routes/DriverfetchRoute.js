// routes/ride.js
import express from 'express';
import {
  getLatestPickupLocation,
  getLatestDropoffLocation
} from '../controllers/DriverfetchController.js';

const router = express.Router();

router.get('/pickup/:userId', getLatestPickupLocation);

router.get('/dropoff/:userId', getLatestDropoffLocation);

export default router;
