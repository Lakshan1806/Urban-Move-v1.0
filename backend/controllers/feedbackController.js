import Feedback from "../models/feedback.model.js";
import User from "../models/usermodel.js";

export const createFeedback = async (req, res) => {
  const { userId, rating, note } = req.body;

  try {
    const feedback = new Feedback({ userId, rating, note });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving feedback", error });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate({
        path: 'userId',
        select: 'username photo',  // Get both username and photo
        model: 'User'    // Make sure this matches your User model name
      })
      .sort({ createdAt: -1 })  // Sort by newest first
      .lean();

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: "Error fetching feedbacks", error });
  }
};