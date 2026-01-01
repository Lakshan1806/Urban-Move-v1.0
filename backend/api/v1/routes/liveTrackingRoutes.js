import express from 'express';
import {
  saveLiveLocation,
  getLiveTrackingLocations,
  clearLiveTracking
} from '../controllers/liveTrackingController.js';
import driverAuth from '../middlewares/driverAuth.js';

const router = express.Router();

router.post('/save', driverAuth, saveLiveLocation);
router.get('/:rideId', driverAuth, getLiveTrackingLocations);
router.delete('/:rideId', driverAuth, clearLiveTracking);

export default router;