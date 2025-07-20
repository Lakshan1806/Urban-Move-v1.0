import mongoose from "mongoose";

const branchLocationSchema = new mongoose.Schema({
  location: { 
    type: String, 
    required: true, 
    unique: true 
  },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("BranchLocation", branchLocationSchema);