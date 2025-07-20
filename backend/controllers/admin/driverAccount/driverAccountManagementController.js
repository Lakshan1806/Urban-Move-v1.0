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
};

export default driverAccountManagementController;
