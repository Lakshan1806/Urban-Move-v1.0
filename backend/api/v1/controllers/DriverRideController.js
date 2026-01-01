//import { CgOpenCollective } from 'react-icons/cg';
import DriverRide from '../models/DriverRideModel.js';
import { getIO } from '../utils/socket.js';


export const saveRide = async (req, res) => {
  try {
    
  
    // Validate required fields
    const requiredFields = ['rideId', 'driverId', 'pickup', 'dropoff', 'fare'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      
    
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validate fare is a positive number
    if (typeof req.body.fare !== 'number' || req.body.fare <= 0) {
      
      return res.status(400).json({
        success: false,
        message: 'Fare must be a positive number'
      });
    }

    // Create new ride document
    const rideData = {
      ...req.body,
      status: 'completed',
      completedAt: new Date()
    };

    

    const savedRide = await DriverRide.create(rideData);

    // Emit socket event
    try {
      const io = getIO();
      console.log(io);
      if (io) {
        io.emit('ride:completed', {
          rideId: savedRide.rideId,
          driverId: savedRide.driverId,
          status: savedRide.status
        });
      }
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
      
    }

    
    return res.status(201).json({
      success: true,
      message: 'Ride saved successfully',
      data: savedRide
    });

  } catch (error) {
    console.error('Detailed error saving ride:', {
      message: error.message,
      stack: error.stack,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    
    return res.status(500).json({
      success: false,
      message: 'Error saving ride',
      error: error.message,
      ...(error.errors && { validationErrors: error.errors })
    });
  }
};

export const getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    // Validate driverId
    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    // Get rides sorted by completion time (newest first)
    const rides = await DriverRide.find({ driverId })
      .sort({ completedAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      data: rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rides',
      error: error.message
    });
  }
};