import CarModel from "../models/carModel.model.js";
import CarInstance from "../models/carInstance.model.js";
import jwt from "jsonwebtoken";

const carManagementController = {
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
      if (req.files) {
        if (req.files.keyImage) {
          keyImage = req.files.keyImage[0].path;
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

  getAllCarModels: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const cars = await CarModel.find().select({
      createdAt: 0,
      updatedAt: 0,
    });
    cars.map((car) => {
      if (car.images) {
        car.images = car.images.map((image) =>
          image.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
        );
      }
      if (car.keyImage) {
        car.keyImage = car.keyImage
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
    });
    res.json(cars);
  },

  getAllCarUnits: async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.query;

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const units = await CarInstance.find({ carID: id }).select({
      createdAt: 0,
      updatedAt: 0,
    });

    res.json(units);
  },

  updateCarModel: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const {
        _id,
        make,
        model,
        year,
        engine,
        transmission,
        bodyStyle,
        fuelType,
        mileage,
        price,
        seat,
        speed,
        description,
      } = req.body;
      const carModel = await CarModel.findByIdAndUpdate(_id, {
        $set: {
          make,
          model,
          year,
          engine,
          transmission,
          bodyStyle,
          fuelType,
          mileage,
          price,
          seat,
          speed,
          description,
        },
      });

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
  updateCarUnit: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { _id, vin, licensePlate, color } = req.body;
      const carUnit = await CarInstance.findByIdAndUpdate(_id, {
        $set: {
          vin,
          licensePlate,
          color,
        },
      });

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
};

export default carManagementController;
