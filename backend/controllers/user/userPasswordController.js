import dotenv from "dotenv";
import nodemailer from "../../utils/nodemailer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

const userPasswordController = (Model, role) => ({
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword, userId } =
        req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "All password fields are required",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "New password and confirm password do not match",
        });
      }
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

      if (!strongPasswordRegex.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters long, include uppercase, lowercase, a number, and a special character",
        });
      }

      const user = await Model.findById(userId).select("+password");

      if (!user) {
        return res.status(404).json({ message: `${role} not found` });
      }

      // Verify current password

      const isMatch = bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "current password is icorrect" });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      await nodemailer.passwordchangeSuccessEmail(user.email);

      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Password change error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await Model.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: `${role} not found` });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;

      await user.save();

      try {
        await nodemailer.sendPasswordResetEmail(
          user.email,
          `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );
      } catch (error) {
        return res.status(500).json({
          message: "Failed to send Reset email",
          error: error.message,
        });
      }
      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

      if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters long, include uppercase, lowercase, a number, and a special character",
        });
      }

      const user = await Model.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await Model.updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpiresAt: undefined,
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Failed to update password");
      }

      const updatedUser = await Model.findById(user._id);

      await nodemailer.sendResetSuccessEmail(updatedUser.email);

      res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
});
export default userPasswordController;
