import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import collection from "./mongo.js"; // Ensure correct ES module import

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/feedback", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err));

// Define the schema to match the frontend fields
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  message: { type: String, required: true },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// POST route to receive feedback
app.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body; // Get data from frontend

    // Ensure all required fields exist
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to MongoDB
    const feedback = new Feedback({ name, email, rating, message });

    console.log("Feedback to be saved:", feedback);

    await feedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8000, () => console.log("Server running on port 8000"));
