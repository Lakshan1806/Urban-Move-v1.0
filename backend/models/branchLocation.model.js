import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    position: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: ([lng, lat]) =>
            Math.abs(lat) <= 90 && Math.abs(lng) <= 180,
          message: "Invalid latitude or longitude",
        },
      },
    },
    location: { type: String, required: true },
    zoom: { type: Number, default: 15 },
  },
  { timestamps: true }
);

export default mongoose.model("BranchLocation", locationSchema);
