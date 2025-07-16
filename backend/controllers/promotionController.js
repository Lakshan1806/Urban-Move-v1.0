import Promotion from "../models/promotion.model.js";

export const applyPromoCode = async (req, res) => {
  try {
    console.log("Promo apply request body:", req.body);

    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Promo code is required" });
    }

    const promo = await Promotion.findOne({ code: code.trim().toUpperCase() });
    if (!promo) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    if (!promo.isValid()) {
      return res.status(400).json({ message: "Promo code is expired, inactive or usage limit reached" });
    }

    return res.status(200).json({
      discount: promo.discountValue,
      discountType: promo.discountType,
      message: "Promo code applied successfully",
    });
  } catch (error) {
    console.error("Error applying promo code:", error);
    return res.status(500).json({ message: "Failed to apply promo code" });
  }
};
