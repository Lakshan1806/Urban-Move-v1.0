import express from 'express';
import {
  acceptRide,
  updateDriverLocation,
  getDriverAcceptance
} from '../controllers/driverAcceptanceController.js';
import driverAuth from '../middlewares/driverAuth.js';


const router = express.Router();

// POST /api/driver/accept
router.post('/accept',driverAuth,acceptRide);

// PUT /api/driver/update-location
router.put('/update-location', updateDriverLocation);

// GET /api/driver/:rideId
router.get('/:rideId', getDriverAcceptance);

export default router;
