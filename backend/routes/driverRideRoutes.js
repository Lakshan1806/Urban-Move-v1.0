import express from 'express';
import { saveRide, getDriverRides } from '../controllers/DriverRideController.js';
import driverAuth from '../middlewares/driverAuth.js';

const router = express.Router();

router.post('/save', driverAuth, saveRide);
router.get('/:driverId', getDriverRides);

export default router;