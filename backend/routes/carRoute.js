import express from "express";
import carController from "../controllers/carController.js";

const router = express.Router();

// Get available cars based on location and time
router.get('/available', carController.getAvailableCars);

// Book a car
router.post('/book', carController.bookCar);

// Get all cars (admin)
router.get('/', carController.getAllCars);

// Get a single car by ID
router.get('/:id', carController.getCarById);

export default router;