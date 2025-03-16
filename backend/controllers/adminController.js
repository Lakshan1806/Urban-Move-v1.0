import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminController = {
  login: async (req, res) => {
    try {
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
      if (isMatch) {
        const payload = { id: admin._id, username: admin.username };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        res.cookie("token", token);
        res.status(200).json({ message: "Login successful" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  },

  profile: (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          throw err;
        }
        res.json(user);
      });
    } else {
      res.json(null);
    }
  },

  changePassword: (req, res) => {
    res.send("Server is ready");
  },
};

export default adminController;
