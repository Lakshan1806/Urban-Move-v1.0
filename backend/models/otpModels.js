import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  email: { type: String },
});

const otp = mongoose.model("Otp", otpSchema);
export default otp;
