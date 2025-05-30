import jwt from "jsonwebtoken";
import Promotion from "../../../models/promotion.model.js";

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

  getAllPromotion: async (req, res) => {
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
        if (promo.photo) {
          promo.photo = promo.photo
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
};

export default promoManagementController;
