import { Router } from "express";
import adminController from "../controllers/adminController.js";
import adminUpload from "#middlewares/adminMulter.js";
import carUpload from "#middlewares/carsMulter.js";
import promotionUpload from "#middlewares/promotionsMulter.js";
import authenticateToken from "#middlewares/adminTokenAuthenticator.js";

const adminRouter = Router();

adminRouter.post("/login", adminController.auth.login);
adminRouter.post("/logout", adminController.auth.logout);
adminRouter.patch("/change_password", adminController.admin.changePassword);
adminRouter.post("/add_admin", adminController.admin.addAdmin);
adminRouter.post(
  "/update_details",
  adminUpload.single("photo"),
  adminController.admin.updateDetails,
);
adminRouter.post(
  "/add_car_model",
  carUpload.fields([
    { name: "keyImage", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  adminController.car.create.addCarModel,
);
adminRouter.post(
  "/update_car_model",
  carUpload.none(),
  adminController.car.update.updateCarModel,
);
adminRouter.post("/add_unit", adminController.car.create.addCarUnit);
adminRouter.post("/update_car_unit", adminController.car.update.updateCarUnit);
adminRouter.post(
  "/add_promotion",
  promotionUpload.single("promoImage"),
  adminController.promotion.addPromotion,
);

adminRouter.get("/get_all_admin", adminController.admin.getAllAdmin);
adminRouter.get("/get_all_user", adminController.customer.getAllUser);
adminRouter.patch("/terminate_user", adminController.customer.terminateUser);
adminRouter.patch("/terminate_driver", adminController.driver.terminateDriver);
adminRouter.patch(
  "/revoke_termination",
  adminController.customer.revokeUserTermination,
);
adminRouter.patch(
  "/revoke_driver_termination",
  adminController.driver.revokeDriverTermination,
);

adminRouter.get("/get_all_driver", adminController.driver.getAllDriver);
adminRouter.get("/profile", authenticateToken, adminController.auth.profile);
adminRouter.get("/account_info", adminController.admin.accountInfo);
adminRouter.get("/get_all_car_models", adminController.car.get.getAllCarModels);
adminRouter.get(
  "/get_all_deleted_car_models",
  adminController.car.get.getAllDeletedCarModels,
);
adminRouter.get(
  "/get_all_deleted_car_units",
  adminController.car.get.getAllDeletedCarUnits,
);
adminRouter.get("/get_all_car_units", adminController.car.get.getAllCarUnits);
adminRouter.get("/get_all_branches", adminController.car.get.getAllBranches);
adminRouter.get(
  "/get_all_promotions",
  adminController.promotion.getAllPromotions,
);
adminRouter.get(
  "/get_all_Expired_promotions",
  adminController.promotion.getAllExpiredPromotions,
);

adminRouter.get(
  "/get_yearly_income",
  adminController.promotion.calculateYearlyIncome,
);

adminRouter.get(
  "/get_monthly_stats",
  adminController.promotion.getMonthlyRideStats,
);

adminRouter.get(
  "/get_branch_locations",
  adminController.promotion.getBranchLocations,
);

adminRouter.get(
  "/get_rent_bookings",
  adminController.promotion.getRentBookings,
);

adminRouter.post(
  "/add_branch_location",
  adminController.promotion.addBranchLocation,
);

adminRouter.patch(
  "/update_car_image",
  carUpload.fields([
    { name: "keyImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "newImage", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  adminController.car.update.updateKeyImage,
);

adminRouter.patch(
  "/deactivate_promotion",
  adminController.promotion.deactivatePromotion,
);

adminRouter.delete(
  "/delete_car_image",
  adminController.car.delete.deleteCarImage,
);
adminRouter.delete(
  "/delete_car_model",
  adminController.car.delete.deleteCarModel,
);
adminRouter.delete(
  "/delete_car_unit",
  adminController.car.delete.deleteCarUnit,
);
adminRouter.post(
  "/restore_car_models",
  adminController.car.delete.restoreCarModel,
);

adminRouter.post(
  "/restore_car_units",
  adminController.car.delete.restoreCarUnit,
);
export default adminRouter;
