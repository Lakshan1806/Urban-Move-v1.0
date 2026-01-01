import express from 'express';
import acceptRide from "../controllers/fetchController.js";

const router = express.Router();

router.post('/change', acceptRide);

export default router;