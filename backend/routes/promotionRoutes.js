import express from "express";
import { applyPromoCode } from "../controllers/promotionController.js";

const router = express.Router();

router.post("/apply", applyPromoCode);

export default router;
