import express from 'express';
import CallLog from '../models/CallLog.js';
import DriverRide from '../models/DriverRide.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, callType, callStatus } = req.body;

    if (!userId || !callType || !callStatus) {
      return res.status(400).json({ error: 'userId, callType and callStatus are required' });
    }

    const latestRide = await DriverRide.findOne({ userId, status: 'completed' }).sort({ createdAt: -1 });

    if (!latestRide) {
      return res.status(404).json({ error: 'No completed ride found for this user' });
    }

    const driverId = latestRide.driverId;

    const newCallLog = new CallLog({ userId, driverId, callType, callStatus });
    await newCallLog.save();

    res.status(201).json(newCallLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save call log', message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const callLogs = await CallLog.find();
    res.status(200).json(callLogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve call logs', message: err.message });
  }
});

export default router;
