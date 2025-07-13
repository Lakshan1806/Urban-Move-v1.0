import Ride from "../models/RideModel.js";
import user from "../models/usermodel.js"

export const getLatestPickupLocation = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "_id name email phone"); // Populate user details

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "No active ride found",
      });
    }

    res.status(200).json({
      success: true,
      pickup: ride.pickup,
      userId: ride.userId?._id,
      userName: ride.userId?.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pickup location",
      error: error.message,
    });
  }
};

export const getLatestDropoffLocation = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "_id");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "No active ride found",
      });
    }

    res.status(200).json({
      success: true,
      dropoff: ride.dropoff,
      userId: ride.userId?._id,
      userName: ride.userId?.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching drop-off location",
      error: error.message,
    });
  }
};

export const getLatestRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findOne({
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "_id name email phone"); 
     
      const User=await user.findOne({
        _id:ride.userId
      })
     
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "No active ride found",
      });
    }
    
    
    res.status(200).json({
      success: true,
      rideDetails: {
        distance: ride.distance,
        duration: ride.duration,
        fare: ride.fare,
        status: ride.status,
        scheduleTime: ride.scheduledTime,
        userId: ride.userId, 
        userDetails: {
          name: User.username,
          email: ride.userId?.email,
          phone: ride.userId?.phone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ride details",
      error: error.message,
    });
  }
};