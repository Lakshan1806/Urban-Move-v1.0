import mongoose from "mongoose";

const driverRideSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    driverId: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    fare: { type: Number, required: true },
    distance: { type: Number, required: true },
  },
  { timestamps: true }
);

const DriverRide =
  mongoose.models.DriverRide || mongoose.model("DriverRide", driverRideSchema);

export default DriverRide;
