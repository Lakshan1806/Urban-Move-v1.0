import express from "express";
import {
  getUserTripHistory,
  getLatestUserRide,
} from "../controllers/tripHistoryController.js";

const router = express.Router();

router.get("/:userId", getUserTripHistory);
router.get("/latest-ride/:userId", getLatestUserRide);

export default router;
