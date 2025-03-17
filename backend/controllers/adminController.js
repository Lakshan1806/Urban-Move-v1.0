import Admin from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateRandomPassword from "../utils/passwordGenerator.js";
import sendWelcomeMail from "../utils/mailer.js";

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

  changePassword: (req, res) => {
    res.send("Server is ready");
  },

  addAdmin: async (req, res) => {
    const { token } = req.cookies;
    const { username, email } = req.body;

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }

    const existingUser = await Admin.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res.status(409).json({ error: "user already exist" });
    }
    const temporaryPassword = generateRandomPassword();
    req.body.password = temporaryPassword;
    req.body.name = "newAdmin";
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    await sendWelcomeMail(email, temporaryPassword, username);
    console.log(`Welcome email sent to ${email}`);
  },

  getAllAdmin: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const admin = await Admin.find().select({
      name: 1,
      username: 1,
      email: 1,
    });
    res.json(admin);
  },
};

export default adminController;
