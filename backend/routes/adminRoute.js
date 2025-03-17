import express from "express";
import adminController from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.login);
adminRoutes.post("/change_password", adminController.changePassword);
adminRoutes.post("/add_admin", adminController.addAdmin);
adminRoutes.get("/get_all_admin", adminController.getAllAdmin);
adminRoutes.get("/profile", adminController.profile);

export default adminRoutes;
