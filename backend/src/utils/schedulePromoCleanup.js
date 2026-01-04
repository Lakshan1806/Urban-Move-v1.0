import Promotion from "../models/promotion.model.js";
import cron from "node-cron";

function schedulePromoCleanup() {
  async function deactivateExpiredPromoCodes() {
    try {
      const update = await Promotion.updateMany(
        { isActive: true, expiresAt: { $lt: new Date() } },
        { $set: { isActive: false } }
      );
      console.log(
        `Promo cleanup: ${update.modifiedCount} promo codes deactivated`
      );
    } catch (err) {
      console.error("Error deactivating promos:", err);
    }
  }

  deactivateExpiredPromoCodes();

  cron.schedule("0 * * * *", deactivateExpiredPromoCodes);
}

export default schedulePromoCleanup;
