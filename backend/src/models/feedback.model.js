import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({

  userId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  note: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Feedback", feedbackSchema);