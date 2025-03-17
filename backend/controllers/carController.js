import  Car from "../models/car.model.js"




const carController = {
    // Get available cars based on location and time
    getAvailableCars : async (req, res) => {
    try {
      const { pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.query;
      
      // Validate required parameters
      if (!pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
        return res.status(400).json({ 
          success: false,
          message: 'Missing required search parameters'
        });
      }
      
      // Validate date/time logic
      const pickupDate = new Date(pickupTime);
      const dropoffDate = new Date(dropoffTime);
      
      if (pickupDate >= dropoffDate) {
        return res.status(400).json({ 
          success: false,
          message: 'Drop-off time must be after pickup time'
        });
      }
      
      // Find all cars in the pickup location
      const allCars = await Car.find({ location: pickupLocation, available: true });
      
      // Filter cars that are available for the requested time period
      const availableCars = allCars.filter(car => 
        car.isAvailable(pickupDate, dropoffDate)
      );
      
      // Calculate rental duration in days (rounded up)
      const durationMs = dropoffDate - pickupDate;
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      
      // Add total price to each car based on duration
      const carsWithPricing = availableCars.map(car => {
        const carObj = car.toObject();
        carObj.totalPrice = car.pricePerDay * durationDays;
        carObj.rentalDays = durationDays;
        return carObj;
      });
      
      res.status(200).json({
        success: true,
        count: carsWithPricing.length,
        data: {
          cars: carsWithPricing,
          pickupLocation,
          dropoffLocation,
          pickupTime: pickupDate,
          dropoffTime: dropoffDate,
          rentalDays: durationDays
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error finding available cars'
      });
    }
  },
  
  // Book a car for the specified time period
    bookCar : async (req, res) => {
    try {
      const { carId, pickupLocation, dropoffLocation, pickupTime, dropoffTime } = req.body;
      
      // Validate required fields
      if (!carId || !pickupLocation || !dropoffLocation || !pickupTime || !dropoffTime) {
        return res.status(400).json({ 
          success: false,
          message: 'All fields are required'
        });
      }
      
      // Validate date/time logic
      const pickupDate = new Date(pickupTime);
      const dropoffDate = new Date(dropoffTime);
      
      if (pickupDate >= dropoffDate) {
        return res.status(400).json({ 
          success: false,
          message: 'Drop-off time must be after pickup time'
        });
      }
      
      // Find the car
      const car = await Car.findById(carId);
      
      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Car not found'
        });
      }
      
      // Check if car is at the right location and available for the time period
      if (car.location !== pickupLocation || !car.isAvailable(pickupDate, dropoffDate)) {
        return res.status(400).json({
          success: false,
          message: 'Car is not available for the requested time and location'
        });
      }
      
      // Add booking to car's bookings array
      car.bookings.push({
        from: pickupDate,
        to: dropoffDate
      });
      
      await car.save();
      
      res.status(200).json({
        success: true,
        message: 'Car booked successfully',
        data: car
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error booking car'
      });
    }
  },
  
  // Get all cars (for admin purposes)
    getAllCars : async (req, res) => {
    try {
      const cars = await Car.find().sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: cars.length,
        data: cars
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching cars'
      });
    }
  },
  
  // Get a single car by ID
    getCarById :  async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      
      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Car not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: car
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching car'
      });
    }
  }
};



export default carController;