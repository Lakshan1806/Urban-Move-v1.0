import express from "express";
import rentalController from "../controllers/rentalController.js";

const router = express.Router();

// Create a new rental
router.post('/', rentalController.createRental);

// Get all rentals
router.get('/', rentalController.getAllRentals);

// Get a single rental by ID
router.get('/:id', rentalController.getRentalById);

// Update a rental
router.put('/:id', rentalController.updateRental);

// Delete a rental
router.delete('/:id', rentalController.deleteRental);

export default router;
