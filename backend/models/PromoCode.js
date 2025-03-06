import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Discount percentage
  expirationDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 }, // Number of times it can be used
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
