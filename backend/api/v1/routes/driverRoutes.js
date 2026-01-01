import express from 'express';
import driverAuth from '../middlewares/driverAuth.js';
import DriverController from '../controllers/DriverController.js';

const router = express.Router();

// Assign driver to ride
router.post('/:rideId/assign', driverAuth, DriverController.assignDriver);

// Update driver location
router.put('/:rideId/location', driverAuth, DriverController.updateDriverLocation);

// Get driver's assigned rides
router.get('/:driverId/rides', driverAuth, DriverController.getDriverRides);

export default router;