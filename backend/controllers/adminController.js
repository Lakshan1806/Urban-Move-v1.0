import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminController = {
  login: async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username }).select({
      password: 1,
      username: 1,
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: admin._id, username: admin.username };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).json({ message: "Login successful", token });
  },

  data: (req, res) => {
    res.send("Sample data");
  },

  root: (req, res) => {
    res.send("Server is ready");
  },
};

export default adminController;
