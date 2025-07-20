import mongoose from 'mongoose';
import CarModel from "../models/carModel.model.js";
import CarInstance from "../models/carInstance.model.js";
import Booking from "../models/carBookings.model.js";
import BranchLocation from "../models/branchLocation.js";

// Get available cars based on location and dates
export const getAvailableCars = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.query;

    // Validate input
    if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date(pickupTime);
    const endDate = new Date(dropoffTime);

    if (startDate >= endDate) {
      return res.status(400).json({ message: "Pickup time must be before dropoff time" });
    }

    if (startDate < new Date()) {
      return res.status(400).json({ message: "Pickup time must be in the future" });
    }

    // Check if locations exist
    const pickupBranch = await BranchLocation.findOne({ location: pickupLocation });
    const dropoffBranch = await BranchLocation.findOne({ location: dropoffLocation });

    if (!pickupBranch || !dropoffBranch) {
      return res.status(404).json({ message: "Invalid pickup or dropoff location" });
    }

    // Find available car instances at pickup location
    const availableInstances = await CarInstance.find({
      location: pickupLocation,
      status: "Available"
    });

    // Check for bookings that overlap with the requested time
    const overlappingBookings = await Booking.find({
      $or: [
        {
          pickupTime: { $lt: endDate },
          dropoffTime: { $gt: startDate }
        }
      ],
      status: { $ne: "Cancelled" }
    });

    // Get IDs of booked car instances
    const bookedCarInstanceIds = overlappingBookings.map(booking => booking.carInstanceID);

    // Filter out instances that are already booked
    const trulyAvailableInstances = availableInstances.filter(
      instance => !bookedCarInstanceIds.includes(instance._id)
    );

    if (trulyAvailableInstances.length === 0) {
      return res.status(200).json({ 
        message: "No cars available for the selected criteria",
        data: { instances: [], cars: [] }
      });
    }

    // Get unique car models from the available instances
    const carModelIds = [...new Set(trulyAvailableInstances.map(instance => instance.carID))];

    // Get car model details
    const carModels = await CarModel.find({ _id: { $in: carModelIds } });

    res.status(200).json({
      message: "Available cars retrieved successfully",
      data: {
        instances: trulyAvailableInstances,
        cars: carModels
      }
    });
  } catch (error) {
    console.error("Error getting available cars:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Book a car (with transaction and atomic update)
export const bookCar = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { carInstanceId, pickupLocation, dropoffLocation, pickupTime, dropoffTime, userId } = req.body;

    // Validate input
    if (!carInstanceId || !pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime || !userId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date(pickupTime);
    const endDate = new Date(dropoffTime);

    if (startDate >= endDate) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Pickup time must be before dropoff time" });
    }

    if (startDate < new Date()) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Pickup time must be in the future" });
    }

    // Atomic update to ensure car is available and mark as booked
    const updatedInstance = await CarInstance.findOneAndUpdate(
      {
        _id: carInstanceId,
        status: "Available" // Only update if status is Available
      },
      {
        status: "Booked"
      },
      {
        new: true,
        session
      }
    );

    if (!updatedInstance) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Car is not available for booking" });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      carInstanceID: carInstanceId,
      pickupTime: { $lt: endDate },
      dropoffTime: { $gt: startDate },
      status: { $ne: "Cancelled" }
    }).session(session);

    if (overlappingBookings.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Car is already booked for the selected time period" });
    }

    // Get car model to calculate price
    const carModel = await CarModel.findById(updatedInstance.carID).session(session);
    if (!carModel) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Car model not found" });
    }

    // Calculate rental days and total price
    const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = rentalDays * carModel.price;

    // Create booking
    const booking = new Booking({
      userID: userId,
      carInstanceID: carInstanceId,
      carModelID: updatedInstance.carID,
      pickupLocation,
      dropoffLocation,
      pickupTime: startDate,
      dropoffTime: endDate,
      totalPrice,
      status: "Confirmed"
    });

    await booking.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      message: "Car booked successfully",
      data: {
        booking,
        carStatus: updatedInstance.status // Should be "Booked"
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error booking car:", error);
    res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};

// Get all branch locations
export const getBranchLocations = async (req, res) => {
  try {
    const locations = await BranchLocation.find({}, 'location -_id');
    const locationNames = locations.map(loc => loc.location);
    res.status(200).json({ 
      message: "Branch locations retrieved successfully",
      data: locationNames 
    });
  } catch (error) {
    console.error("Error getting branch locations:", error);
    res.status(500).json({ message: "Server error" });
  }
};