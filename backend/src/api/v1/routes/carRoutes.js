import express from "express";
import {
  getAvailableCars,
  bookCar,
  getBranchLocations
} from "../controllers/carController.js";

const router = express.Router();

// Get available cars
router.get("/available", getAvailableCars);

// Book a car
router.post("/book", bookCar);

// Get branch locations
router.get("/locations", getBranchLocations);

export default router;