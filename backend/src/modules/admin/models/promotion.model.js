import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      required: true,
    },
    promotionType: {
      type: String,
      enum: ["Rent", "Ride"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    maxUses: { type: Number, default: 1, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 1 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    description: { type: String, required: true },
    path: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

promoCodeSchema.methods.isValid = function () {
  if (!this.isActive) {
    return false;
  }
  if (this.usedCount >= this.maxUses) {
    return false;
  }
  if (this.expiresAt < new Date()) {
    return false;
  }
  return true;
};

export default mongoose.model("Promotion", promoCodeSchema);
