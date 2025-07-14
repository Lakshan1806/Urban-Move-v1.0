import Admin from "../../../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateRandomPassword from "../../../utils/passwordGenerator.js";
import sendWelcomeMail from "../../../utils/mailer.js";

const adminAccountManagementController = {
  changePassword: async (req, res) => {
    const { token } = req.cookies;
    const { currentPassword, newPassword } = req.body;
    console.log(req);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(user);
      const { _id } = user;
      const admin = await Admin.findOne({ _id }).select({
        password: 1,
      });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      
      admin.password = newPassword;
      await admin.save();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
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
    const admins = await Admin.find().select({
      name: 1,
      username: 1,
      email: 1,
      photo: 1,
      role: 1,
    });
    admins.map((admin) => {
      //console.log(admin.photo)
      if (admin.photo) {
        admin.photo = admin.photo
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
    });
    res.json(admins);
  },

  accountInfo: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(user);
      const { _id } = user;
      const admin = await Admin.findOne({ _id }).select({
        name: 1,
        username: 1,
        email: 1,
        phone: 1,
        photo: 1,
      });
      admin.photo = admin.photo
        .replace(/\\/g, "/")
        .replace("backend/uploads", "/uploads");

      res.json(admin);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  updateDetails: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log(user);
      const { _id } = user;
      const { name, username, email, phone } = req.body;
      if (req.file && req.file.path) {
        const admin = await Admin.findByIdAndUpdate(_id, {
          $set: { photo: req.file.path },
        });
        console.log("Uploaded file:", req.file);
      }

      const admin = await Admin.findByIdAndUpdate(_id, {
        $set: {
          name,
          username,
          email,
          phone,
        },
      });

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
};

export default adminAccountManagementController;
