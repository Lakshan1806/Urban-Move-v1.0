import jwt from "jsonwebtoken";
import CarModel from "../../../models/carModel.model.js";
import CarInstance from "../../../models/carInstance.model.js";
import fs from "fs/promises";
import path from "path";

const updateController = {
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
      const updatedCar = await CarModel.findByIdAndUpdate(
        _id,
        {
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
        },
        { new: true }
      ).select({
        createdAt: 0, 
        updatedAt: 0,
      });
      if (updatedCar.images) {
        updatedCar.images = updatedCar.images.map((image) =>
          image.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
        );
      }
      if (updatedCar.keyImage) {
        updatedCar.keyImage = updatedCar.keyImage
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
      if (updatedCar.logo) {
        updatedCar.logo = updatedCar.logo 
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
      console.log(updatedCar);
      res.status(200).json({ message: "upadate successful", updatedCar });
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
      const { _id, vin, licensePlate, color, location } = req.body;
      const carUnit = await CarInstance.findByIdAndUpdate(_id, {
        $set: {
          vin,
          licensePlate,
          color,
          location,
        },
      });

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  updateKeyImage: async (req, res) => {
    const { token } = req.cookies;
    console.log("update body:", req.body);
    console.log("update files:", req.files);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { carId } = req.body;
      let oldPath = null;
      let newImagePath = null;
      let newPath = null;
      let keyImage = null;
      let logo = null;
      const existingCar = await CarModel.findById(carId).lean();
      if (!existingCar) {
        return res.status(404).json({ error: "Car not found" });
      }

      keyImage = existingCar.keyImage;
      logo = existingCar.logo;

      if (req.files) {
        if (req.files.keyImage) {
          keyImage = req.files.keyImage[0].path;
        }
        if (req.files.image) {
          newPath = req.files.image[0].path;
          oldPath = req.body.imagePath;
          console.log("old image:", req.body.imagePath);
          oldPath = oldPath
            .replace("/uploads", "backend/uploads")
            .replace(/\//g, "\\");
        }
        if (req.files.newImage) {
          newImagePath = req.files.newImage[0].path;
        }
        if (req.files.logo) {
          logo = req.files.logo[0].path;
          console.log("new logo", req.files.logo[0].path);
        }
      }

      if (keyImage !== existingCar.keyImage && existingCar.keyImage) {
        try {
          const absoluteOldPath = path.resolve(existingCar.keyImage);
          await fs.unlink(absoluteOldPath);
          console.log("successfully deleted");
        } catch (unlinkErr) {
          console.warn("Failed to delete old keyImage:", unlinkErr);
        }
      }
      console.log(newPath);
      if (newPath) {
        try {
          const absoluteOldPath = path.resolve(oldPath);
          await fs.unlink(absoluteOldPath);
          console.log("successfully deleted");
        } catch (unlinkErr) {
          console.warn("Failed to delete old Image:", unlinkErr);
        }

        const updated = await CarModel.findOneAndUpdate(
          { _id: carId, images: oldPath },
          { $set: { "images.$": newPath } },
          { new: true }
        );
        if (!updated) {
          return res.status(404).json({ error: "image - Car not found" });
        }
      }

      if (logo !== existingCar.logo && existingCar.logo) {
        try {
          const absoluteOldPath = path.resolve(existingCar.logo);
          await fs.unlink(absoluteOldPath);
          console.log("successfully deleted", absoluteOldPath);
        } catch (unlinkErr) {
          console.warn("Failed to delete old Image:", unlinkErr);
        }
      }
      if (logo) {
        const updated = await CarModel.findByIdAndUpdate(
          carId,
          { $set: { logo } },
          { new: true }
        );
        if (!updated) {
          return res.status(404).json({ error: "key image - Car not found" });
        }
      }
      if (keyImage) {
        const updatedCar = await CarModel.findByIdAndUpdate(
          carId,
          { $set: { keyImage } },
          { new: true }
        );
        if (!updatedCar) {
          return res.status(404).json({ error: "key image - Car not found" });
        }
      }
      if (newImagePath) {
        const updatedCar = await CarModel.findByIdAndUpdate(
          carId,
          { $addToSet: { images: newImagePath } },
          { new: true }
        );
        if (!updatedCar) {
          return res.status(404).json({ error: "new image - Car not found" });
        }
      }

      return res.status(200).json({ success: "success" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
};

export default updateController;
//logo-1749320195054-437139927-Nissan.svg
