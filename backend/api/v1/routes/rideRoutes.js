import express from "express";
const rideRoutes = express.Router();


import { 
  createRide,
  startTracking, 
  getRideStatus, 
  updateDriverLocation,
  completeRide,
  cancelRide  
} from '../controllers/rideCountroller.js';
import userAuth from '../middlewares/userAuth.js';

rideRoutes.post('/', userAuth, createRide);
rideRoutes.post('/start-tracking', userAuth, startTracking);
rideRoutes.get('/status/:rideId', userAuth, getRideStatus);
rideRoutes.post('/update-location', userAuth, updateDriverLocation);
rideRoutes.post('/complete', userAuth, completeRide);
rideRoutes.post('/cancel/:rideId', userAuth, cancelRide);  


export default rideRoutes;
