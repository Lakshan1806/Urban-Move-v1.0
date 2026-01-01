import jwt from "jsonwebtoken";
import CarModel from "../../../models/carModel.model.js";
import DeletedCarModel from "../../../models/recentlyDeletedCar.model.js";
import DeletedCarUnit from "../../../models/recentlyDeletedUnit.model.js";
import CarInstance from "../../../models/carInstance.model.js";
import BranchLocation from "../../../models/branchLocation.model.js";

const getController = {
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
      if (car.logo) {
        car.logo = car.logo
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
    });
    res.json(cars);
  },

  getAllDeletedCarModels: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const cars = await DeletedCarModel.find().select({
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

  getAllBranches: async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.query;

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const locations = await BranchLocation.find().select({
      location: 1,
    });

    res.json(locations);
  },

  getAllDeletedCarUnits: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const cars = await DeletedCarUnit.find().select({
      createdAt: 0,
      updatedAt: 0,
    });
    /*
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
    }); */
    res.json(cars);
  },
};

export default getController;
