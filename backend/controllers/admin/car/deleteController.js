import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import CarModel from "../../../models/carModel.model.js";
import CarInstance from "../../../models/carInstance.model.js";
import RecentlyDeletedCar from "../../../models/recentlyDeletedCar.model.js";
import RecentlyDeletedUnit from "../../../models/recentlyDeletedUnit.model.js";

const deleteController = {
  deleteCarImage: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    console.log(req.files);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { carId } = req.body;
      let { imagePath } = req.body;
      if (imagePath) {
        imagePath = imagePath
          .replace("/uploads", "backend/uploads")
          .replace(/\//g, "\\");
      }

      let updatedCar;
      try {
        updatedCar = await CarModel.findByIdAndUpdate(
          carId,
          { $pull: { images: imagePath } },
          { new: true }
        );
        if (!updatedCar) {
          return res.status(404).json({ error: "Car not found" });
        }
      } catch (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Failed to update car images" });
      }

      try {
        const absolutePath = path.resolve(imagePath);
        await fs.unlink(absolutePath);
        console.log("File deleted:", absolutePath);
      } catch (unlinkErr) {
        console.warn("File deletion error:", unlinkErr);
      }

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

      return res.status(200).json({ success: "success", updatedCar });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  deleteCarModel: async (req, res) => {
    const { token } = req.cookies;
    const { carId } = req.body;

    console.log(req.body);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const deletedModel = await CarModel.findByIdAndDelete(carId);
      const deletedUnit = await CarInstance.find({ carID: carId });
      if (!deletedModel) {
        return res.status(404).json({ error: "Car not found" });
      }

      const modelObject = deletedModel.toObject();
      await RecentlyDeletedCar.create(modelObject);

      const unitArray = deletedUnit.map((unitObject) => unitObject.toObject());
      await RecentlyDeletedUnit.insertMany(unitArray);

      await CarInstance.deleteMany({ carID: carId });

      return res
        .status(200)
        .json({ message: "Car deleted and moved to recently_deleted" });
    } catch (error) {}
  },

  deleteCarUnit: async (req, res) => {
    const { token } = req.cookies;
    const { unitId } = req.body;

    console.log(req.body);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const deletedUnit = await CarInstance.findByIdAndDelete(unitId);
      if (!deletedUnit) {
        return res.status(404).json({ error: "Unit not found" });
      }

      const unitObject = deletedUnit.toObject();
      await RecentlyDeletedUnit.create(unitObject);

      return res
        .status(200)
        .json({ message: "Unit deleted and moved to recently_deleted" });
    } catch (error) {}
  },

  restoreCarModel: async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.query;

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const deletedCar = await RecentlyDeletedCar.findById(id);
    if (!deletedCar) {
      return res.status(404).json({ error: "No such recently‐deleted car" });
    }

    const dataToRestore = deletedCar.toObject();
    const recreated = await CarModel.create(dataToRestore);
    await RecentlyDeletedCar.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Restored successfully", car: recreated });
  },

  restoreCarUnit: async (req, res) => {
    const { token } = req.cookies;
    const { unitID, carID } = req.query;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const car = await CarModel.findById(carID);
      if (car) {
        const deletedUnit = await RecentlyDeletedUnit.findById(unitID);
        if (!deletedUnit) {
          return res
            .status(404)
            .json({ error: "No such recently‐deleted unit" });
        }
        const dataToRestore = deletedUnit.toObject();
        const unit = await CarInstance.findById(unitID);
        if (!unit) {
          const recreated = await CarInstance.create(dataToRestore);
          await RecentlyDeletedUnit.findByIdAndDelete(unitID);
        }

        return res
          .status(200)
          .json({ message: "Restored successfully", car: recreated });
      } else {
        return res.status(401).json({ message: "Car model not found" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default deleteController;
