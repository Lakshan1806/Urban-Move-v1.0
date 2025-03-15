import express from "express";
import adminController from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.login);
adminRoutes.post("/logout");
adminRoutes.post("/change_password");
adminRoutes.post("/add_admin");
adminRoutes.get("/get_info");
adminRoutes.get("/profile", adminController.profile);

export default adminRoutes;
