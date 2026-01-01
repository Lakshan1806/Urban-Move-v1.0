import dotenv from "dotenv";
import ArchivedUser from "../../models/archivedUser.model.js";
import nodemailer from "../../utils/nodemailer.js";
import ArchivedDriver from "../../models/archivedDriver.models.js";

dotenv.config();

const userProfileController = (Model, role) => ({
  getUserProfile: async (req, res) => {
    try {
      const id = req.body.driverId || req.body.userId;
      if (!id) {
        return res.status(400).json({ message: `${role} ID is required` });
      }
      const user = await Model.findById(id).select({
        fullname: 1,
        username: 1,
        email: 1,
        phone: 1,
        photo: 1,
        age: 1,
        address: 1,
        nicNumber: 1,
        carColor: 1,
        carNumber: 1,
      });

      user.photo = user.photo
        .replace(/\\/g, "/")
        .replace("backend/uploads", "/uploads");

      res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const {
        username,
        email,
        phone,
        userId,
        fullname,
        nicNumber,
        address,
        age,
        carNumber,
        carColor,
      } = req.body;

      console.log("Update profile request body:", req.body);

      if (!userId) {
        return res.status(400).json({ message: `${role} is required` });
      }

      if (!username || !email || !phone) {
        return res
          .status(400)
          .json({ message: "Username, email, and phone are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (req.file && req.file.path) {
        const user = await Model.findByIdAndUpdate(req.body.userId, {
          $set: { photo: req.file.path },
        });
        console.log("Uploaded file:", req.file);
      }

      const updatedUser = await Model.findByIdAndUpdate(userId, {
        $set: {
          fullname,
          username,
          email,
          phone,
          address,
          nicNumber,
          age,
          carColor,
          carNumber,
        },
      });

      res.status(200).json({ message: "update successful" });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const { reason, userId } = req.body;

      const user = await Model.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (role === "user") {
        const archivedUser = new ArchivedUser({
          originalId: user._id,
          ...user.toObject(),
          reasonForDeletion: reason || "No reason provided",
          deletedAt: new Date(),
        });
        await archivedUser.save();
        await nodemailer.deleteAccountEmail(user.email);

        await Model.findByIdAndDelete(userId);
      } else {
        const archivedDriver = new ArchivedDriver({
          originalId: user._id,
          ...user.toObject(),
          reasonForDeletion: reason || "No reason provided",
          deletedAt: new Date(),
        });
        await archivedDriver.save();
        await nodemailer.deleteAccountEmail(user.email);

        await Model.findByIdAndDelete(userId);
      }

      res.clearCookie("token");

      res
        .status(200)
        .json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Account deletion failed",
        error: error.message,
      });
    }
  },
});
export default userProfileController;
