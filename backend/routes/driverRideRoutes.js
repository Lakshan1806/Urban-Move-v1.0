import express from 'express';
import { saveRide, getDriverRides } from '../controllers/DriverRideController.js';
import driverAuth from '../middlewares/driverAuth.js';
import DriverRide from '../models/DriverRide.js';

const router = express.Router();

router.post('/save', driverAuth, saveRide);
router.get('/:driverId', getDriverRides);

router.get('/latest-ride/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; 

    const latestRide = await DriverRide.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestRide) {
      return res.status(404).json({ message: "No ride found for this user" });
    }

    res.json(latestRide);
  } catch (err) {
    console.error("Error fetching latest ride:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
