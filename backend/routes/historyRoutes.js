import express from "express";
import History from "../models/History.js"; // Import your History model

const router = express.Router();

// Store completed trip in history
router.post("/add", async (req, res) => {
  try {
    const newHistory = new History(req.body);
    await newHistory.save();
    res.status(201).json({ message: "Trip added to history", newHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get history for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const userHistory = await History.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(userHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; // ✅ Use `export default` for ESM compatibility
