import jwt from "jsonwebtoken";
import CarModel from "../../../models/carModel.model.js";
import RecentlyDeletedCar from "../../../models/recentlyDeletedCar.model.js";

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

      return res.status(200).json({ success: "success" });
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
      if (!deletedModel) {
        return res.status(404).json({ error: "Car not found" });
      }

      const modelObject = deletedModel.toObject();
      await RecentlyDeletedCar.create(modelObject);

      return res
        .status(200)
        .json({ message: "Car deleted and moved to recently_deleted" });
    } catch (error) {}
  },
};

export default deleteController;
