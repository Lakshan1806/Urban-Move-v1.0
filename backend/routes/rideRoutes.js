//live tracing implements
import { 
  createRide,
  startTracking, 
  getRideStatus, 
  updateDriverLocation,
  completeRide 
} from '../controllers/rideController.js';
import userAuth from '../middlewares/userAuth.js';

// Create ride endpoint
router.post('/', userAuth, createRide);

// Corrected endpoints with proper base path
router.post('/api/rides/start-tracking', userAuth, startTracking);
router.get('/api/rides/status/:rideId', userAuth, getRideStatus);
router.post('/api/rides/update-location', userAuth, updateDriverLocation);
router.post('/api/rides/complete', userAuth, completeRide);

// In your routes file
router.post('/schedule', ridesController.scheduleRide);
router.get('/scheduled', ridesController.getScheduledRides);
router.delete('/scheduled/:id', ridesController.cancelScheduledRide);

export default router;