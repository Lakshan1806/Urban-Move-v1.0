import express from 'express';
import { declineRide } from '../controllers/DriverDeclineController.js';

const router = express.Router();

router.put('/:rideId', declineRide);

export default router;