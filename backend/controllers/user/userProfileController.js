import dotenv from "dotenv";
import userModel from "../../models/usermodel.js";

dotenv.config();

const userProfileController = {
  getUserProfile: async (req, res) => {
    try {
      const user = await userModel.findById(req.body.userId).select({
        fullname: 1,
        username: 1,
        email: 1,
        phone: 1,
        photo: 1,
        age: 1,
        address: 1,
        nicNumber: 1,
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
      const { username, email, phone, userId, fullname, nicNumber, address, age } = req.body;

      if (!username || !email || !phone ) {
        return res
          .status(400)
          .json({ message: "Username, email, and phone are required" });
      }
      if (req.file && req.file.path) {
        const user = await userModel.findByIdAndUpdate(req.body.userId, {
          $set: { photo: req.file.path },
        });
        console.log("Uploaded file:", req.file);
      }

      const updatedUser = await userModel.findByIdAndUpdate(userId, {
        $set: {
          fullname,
          username,
          email,
          phone,
          address,
          nicNumber,
          age,
        },
      });

      res.status(200).json({ message: "update successful" });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
};
export default userProfileController;
