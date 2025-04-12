import express from "express";
import adminController from "../controllers/adminController.js";
import adminUpload from "../middlewares/adminMulter.js";
import carUpload from "../middlewares/carsMulter.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.login);
adminRoutes.post("/change_password", adminController.changePassword);
adminRoutes.post("/add_admin", adminController.addAdmin);
adminRoutes.post(
  "/update_details",
  adminUpload.single("photo"),
  adminController.updateDetails
);
adminRoutes.post(
  "/add_car_model",
  carUpload.array("photos"),
  adminController.addCarModel
);
adminRoutes.post("/add_unit", adminController.addCarUnit);
adminRoutes.post("/update_car_model",carUpload.none(), adminController.updateCarModel);
adminRoutes.post("/update_car_unit", adminController.updateCarUnit);
adminRoutes.get("/get_all_admin", adminController.getAllAdmin);
adminRoutes.get("/get_all_car_models", adminController.getAllCarModels);
adminRoutes.get("/get_all_car_units", adminController.getAllCarUnits);
adminRoutes.get("/profile", adminController.profile);
adminRoutes.get("/account_info", adminController.accountInfo);

export default adminRoutes;
