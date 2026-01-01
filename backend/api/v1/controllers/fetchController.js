import Ride from "../models/RideModel.js";

const acceptRide = async (req, res) => {
  try {
    const { rideId, currentLocation } = req.body;

    // Validate required fields
    if (!rideId || !currentLocation) {
      return res.status(400).json({
        success: false,
        message: "rideId and currentLocation are required",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    // Check if ride is already accepted
    if (ride.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Ride already accepted by a driver",
      });
    }

    // Update ride details
    ride.status = "accepted";
    ride.driverLocation = currentLocation;

    await ride.save();

    return res.status(200).json({
      success: true,
      message: "Ride accepted successfully",
      ride,
    });

  } catch (error) {
    console.error("Accept Ride Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while accepting the ride",
    });
  }
};

export default acceptRide;
