import express from "express";
import { applyPromoCode, getActivePromotions } from "../controllers/promotionController.js";

const router = express.Router();

router.post("/apply", applyPromoCode);
router.get("/active", getActivePromotions);

export default router;
