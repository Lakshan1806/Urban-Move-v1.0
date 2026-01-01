import jwt from "jsonwebtoken";
import Promotion from "../../../models/promotion.model.js";
import Ride from "../../../models/RideModel.js";
import BranchLocation from "../../../models/branchLocation.model.js";
import Booking from "../../../models/carBookings.model.js";
import CarInstance from "../../../models/carInstance.model.js";
import CarModel from "../../../models/carModel.model.js";
import User from "../../../models/usermodel.js";

const promoManagementController = {
  addPromotion: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log(req.file);

      if (req.file) {
        if (req.file.path) {
          req.body.path = req.file.path;
        }
      }

      console.log(req.body);

      const newPromo = new Promotion(req.body);
      await newPromo.save();

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  deactivatePromotion: async (req, res) => {
    const { token } = req.cookies;
    const { promotionId } = req.body;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      await Promotion.findByIdAndUpdate(promotionId, { isActive: false });
      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  getAllPromotions: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const now = new Date();

      const promotions = await Promotion.find({
        isActive: true,
        expiresAt: { $gt: now },

        $expr: { $lt: ["$usedCount", "$maxUses"] },
      }).select({
        code: 1,
        discountType: 1,
        discountValue: 1,
        expiresAt: 1,
        description: 1,
        path: 1,
      });

      console.log(promotions);
      promotions.map((promo) => {
        if (promo.path) {
          promo.path = promo.path
            .replace(/\\/g, "/")
            .replace("backend/uploads", "/uploads");
        }
      });
      res.json(promotions);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  getAllExpiredPromotions: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const now = new Date();

      const promotions = await Promotion.find({
        isActive: false,
      }).select({
        code: 1,
        discountType: 1,
        discountValue: 1,
        expiresAt: 1,
        description: 1,
        path: 1,
      });

      console.log(promotions);
      promotions.map((promo) => {
        if (promo.path) {
          promo.path = promo.path
            .replace(/\\/g, "/")
            .replace("backend/uploads", "/uploads");
        }
      });
      res.json(promotions);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  calculateYearlyIncome: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const rides = await Ride.find({
        status: "completed",
      }).select({
        fare: 1,
      });
      let rideIncome = 0;
      let fare = 0;
      console.log(rides);
      rides.map((ride) => {
        fare = ride.fare * 0.2;
        rideIncome = rideIncome + fare;
      });
      return res.json(rideIncome);
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  getMonthlyRideStats: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const year = new Date().getFullYear();
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31, 23, 59, 59, 999);
      const wanted = ["completed", "cancelled"];

      const raw = await Ride.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $in: wanted },
          },
        },
        {
          $group: {
            _id: { m: { $month: "$createdAt" }, s: "$status" },
            count: { $sum: 1 },
          },
        },
      ]);

      const months = Array.from({ length: 12 }, () => ({
        completed: 0,
        cancelled: 0,
      }));

      raw.forEach(({ _id, count }) => {
        const idx = _id.m - 1;
        months[idx][_id.s] = count;
      });

      res.json({
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        completed: months.map((m) => m.completed),
        cancelled: months.map((m) => m.cancelled),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Analytics query failed" });
    }
  },

  getBranchLocations: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const locations = await BranchLocation.find();

      return res.json(locations);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Failed to fetch branch locations" });
    }
  },

  addBranchLocation: async (req, res) => {
    const { token } = req.cookies;
    const { location, lat, lng } = req.body;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const pin = await BranchLocation.create({
        location,
        position: {
          type: "Point",
          coordinates: [lng, lat],
        },
      });

      return res.status(201).json(pin);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save location" });
    }
  },

  getRentBookings: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const bookings = await Booking.find().lean();

      const enriched = await Promise.all(
        bookings.map(async (bk) => {
          const [user, carInstance, carModel] = await Promise.all([
            User.findById(bk.userID).select("username email phone").lean(),

            CarInstance.findById(bk.carInstanceID)
              .select("vin licensePlate color")
              .lean(),

            CarModel.findById(bk.carModelID).select("make model").lean(),
          ]);

          return { ...bk, user, carInstance, carModel };
        })
      );

      return res.json(enriched);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch" });
    }
  },
};

export default promoManagementController;
