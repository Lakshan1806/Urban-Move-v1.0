//live tracing implements
import express from "express";
const rideRoutes = express.Router();

import { 
  createRide,
  startTracking, 
  getRideStatus, 
  updateDriverLocation,
  completeRide 
} from '../controllers/rideCountroller.js';
import userAuth from '../middlewares/userAuth.js';

// Create ride endpoint
rideRoutes.post('/', userAuth, createRide);

// Corrected endpoints with proper base path
rideRoutes.post('/start-tracking', userAuth, startTracking);
rideRoutes.get('/status/:rideId', userAuth, getRideStatus);
rideRoutes.post('/update-location', userAuth, updateDriverLocation);
rideRoutes.post('/complete', userAuth, completeRide);





export default rideRoutes;