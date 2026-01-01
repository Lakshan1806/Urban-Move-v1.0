import jwt from "jsonwebtoken";
import CarModel from "../../../models/carModel.model.js";
import CarInstance from "../../../models/carInstance.model.js";

const createController = {
  addCarModel: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log(req.body);
      const filePaths = [];
      let keyImage = null;
      let logo = null;
      if (req.files) {
        if (req.files.keyImage) {
          keyImage = req.files.keyImage[0].path;
        }
        if (req.files.logo) {
          keyImage = req.files.logo[0].path;
        }
        if (req.files.photos && req.files.photos.length > 0) {
          req.files.photos.forEach((file) => filePaths.push(file.path));
          console.log("Uploaded file:", req.files);
        }
      }

      const newCarModel = new CarModel({
        ...req.body,
        images: filePaths,
        keyImage,
        logo,
      });
      await newCarModel.save();

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  addCarUnit: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log(req.body);

      const newCarUnit = new CarInstance(req.body);
      await newCarUnit.save();

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
};

export default createController;
