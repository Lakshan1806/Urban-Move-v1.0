import express from "express";
import Promotion from "#modules/admin/models/promotion.model.js";

const router = express.Router();

router.post("/process-payment", async (req, res) => {
  try {
    const { amount, promoCode } = req.body;
    let finalAmount = amount;

    if (promoCode) {
      const promo = await Promotion.findOne({ code: promoCode.toUpperCase() });

      if (
        promo &&
        promo.isActive &&
        promo.expiresAt > new Date() &&
        promo.usedCount < promo.maxUses
      ) {
        if (promo.discountType === "Percentage") {
          finalAmount -= (amount * promo.discountValue) / 100;
        } else {
          finalAmount -= promo.discountValue;
        }
      }
    }

    res.json({ message: "Payment successful", amountPaid: finalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
