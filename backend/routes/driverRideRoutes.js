import express from 'express';
import { saveRide, getDriverRides } from '../controllers/DriverRideController.js';

const router = express.Router();

router.post('/save', saveRide);
router.get('/:driverId', getDriverRides);

export default router;