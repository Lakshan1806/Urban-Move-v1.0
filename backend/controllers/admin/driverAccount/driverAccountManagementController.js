import Driver from "../../../models/driver.models.js";
import jwt from "jsonwebtoken";

const driverAccountManagementController = {
  getAllDriver: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const drivers = await Driver.find().select({
      username: 1,
      phone: 1,
      email: 1,
      photo: 1,
      avatar: 1,
      authMethod: 1,
      isTerminated: 1,
      isAccountVerified: 1,
      carColor: 1,
      carNumber: 1,
    });

    drivers.map((driver) => {
      //console.log(user.photo);
      if (driver.photo) {
        driver.photo = driver.photo
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
    });

    res.json(drivers);
  },

  terminateDriver: async (req, res) => {
    const { token } = req.cookies;
    const { _id } = req.body;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await Driver.findOneAndUpdate(
        { _id: _id, isTerminated: false },
        { $set: { isTerminated: true } },
        { new: true }
      ).select({
        username: 1,
        phone: 1,
        email: 1,
        photo: 1,
        avatar: 1,
        authMethod: 1,
        isTerminated: 1,
        isAccountVerified: 1,
        carColor: 1,
        carNumber: 1,
      });

      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save location" });
    }
  },

  revokeDriverTermination: async (req, res) => {
    const { token } = req.cookies;
    const { _id } = req.body;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await Driver.findOneAndUpdate(
        { _id: _id, isTerminated: true },
        { $set: { isTerminated: false } },
        { new: true }
      ).select({
        username: 1,
        phone: 1,
        email: 1,
        photo: 1,
        avatar: 1,
        authMethod: 1,
        isTerminated: 1,
        isAccountVerified: 1,
        carColor: 1,
        carNumber: 1,
      });

      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save location" });
    }
  },
};

export default driverAccountManagementController;
