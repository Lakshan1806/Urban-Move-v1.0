import express from "express";
import adminController from "../controllers/admin/adminController.js";
import adminUpload from "../middlewares/adminMulter.js";
import carUpload from "../middlewares/carsMulter.js";
import promotionUpload from "../middlewares/promotionsMulter.js";
import authenticateToken from "../middlewares/adminTokenAuthenticator.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.auth.login);
adminRoutes.post("/change_password", adminController.admin.changePassword);
adminRoutes.post("/add_admin", adminController.admin.addAdmin);
adminRoutes.post(
  "/update_details",
  adminUpload.single("photo"),
  adminController.admin.updateDetails
);
adminRoutes.post(
  "/add_car_model",
  carUpload.fields([
    { name: "keyImage", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  adminController.car.create.addCarModel
);
adminRoutes.post(
  "/update_car_model",
  carUpload.none(),
  adminController.car.update.updateCarModel
);
adminRoutes.post("/add_unit", adminController.car.create.addCarUnit);
adminRoutes.post("/update_car_unit", adminController.car.update.updateCarUnit);
adminRoutes.post(
  "/add_promotion",
  promotionUpload.single("promoImage"),
  adminController.promotion.addPromotion
);

adminRoutes.get("/get_all_admin", adminController.admin.getAllAdmin);
adminRoutes.get("/get_all_user", adminController.customer.getAllUser);
adminRoutes.get("/get_all_driver", adminController.driver.getAllDriver);
adminRoutes.get("/profile", authenticateToken, adminController.auth.profile);
adminRoutes.get("/account_info", adminController.admin.accountInfo);
adminRoutes.get("/get_all_car_models", adminController.car.get.getAllCarModels);
adminRoutes.get("/get_all_car_units", adminController.car.get.getAllCarUnits);

adminRoutes.patch(
  "/update_car_image",
  carUpload.fields([
    { name: "keyImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "newImage", maxCount: 1 },
  ]),
  adminController.car.update.updateKeyImage
);

adminRoutes.delete(
  "/delete_car_image",
  adminController.car.delete.deleteCarImage
);
adminRoutes.delete(
  "/delete_car_model",
  adminController.car.delete.deleteCarModel
);
export default adminRoutes;
