import Admin from "../../../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

const adminAuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password required" });
      }
      const admin = await Admin.findOne({ username }).select({
        password: 1,
        username: 1,
        role: 1, 
      });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (isMatch) {
        const payload = {
          _id: admin._id,
          username: admin.username,
          role: admin.role,
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

        res.cookie("token", token, {
          httpOnly: true,
          path: "/admin",
        });

        res.status(200).json({ message: "Login successful" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  },

  logout: async (req, res) => {
    res.clearCookie("token", {
      path: "/admin",
      httpOnly: true,
    });
    res.sendStatus(204);
  },

  profile: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
        res.json(user);
      });
    } else {
      res.json(null);
    }
  },
};
export default adminAuthController;
