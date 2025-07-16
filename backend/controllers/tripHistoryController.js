import DriverRide from "../models/DriverRide.js";

//Get all trips for a user
export const getUserTripHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rides = await DriverRide.find({ userId }).sort({ createdAt: -1 });

    if (!rides.length) {
      return res.status(404).json({ message: `No trip history found for user ID: ${userId}` });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching trip history:", error);
    res.status(500).json({ error: "Failed to fetch trip history" });
  }
};

//Get the latest ride for a user
export const getLatestUserRide = async (req, res) => {
  try {
    const userId = req.params.userId;
    const latestRide = await DriverRide.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestRide) {
      return res.status(404).json({ message: `No latest ride found for user ID: ${userId}` });
    }

    res.status(200).json(latestRide);
  } catch (error) {
    console.error("Error fetching latest ride:", error);
    res.status(500).json({ error: "Failed to fetch latest ride" });
  }
};
