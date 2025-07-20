import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carInstanceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarInstance",
      required: true,
    },
    carModelID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarModel",
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupTime: { type: Date, required: true },
    dropoffTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
