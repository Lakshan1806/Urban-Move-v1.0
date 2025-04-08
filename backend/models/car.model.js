import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, unique: true, required: true },
    licensePlate: { type: String, unique: true, required: true },
    engine: { type: String },
    transmission: { type: String },
    bodyStyle: { type: String },
    fuelType: { type: String },
    mileage: { type: Number },
    color: { type: String },
    price: { type: Number },
    status: { type: String, enum: ["Booked", "Available"] },
    features: [{ type: String }],
    images: [{ type: String }],
    description: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
