// routes/driverRideRoutes.js
import express from 'express';
import { saveRideHistory, getDriverRideHistory } from '../controllers/DriverRideController.js';

const router = express.Router();

router.post('/save', saveRideHistory);
router.get('/history/:driverId', getDriverRideHistory);

export default router;