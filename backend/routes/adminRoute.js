import express from "express";

const adminRoutes = express.Router();

adminRoutes.post("/login")
adminRoutes.post("/logout")
adminRoutes.post("/change_password")
adminRoutes.post("/add_admin")
adminRoutes.get("/get_info")

export default adminRoutes;
