import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import authController from "../controllers/authController.js";

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/reset-password", userController.resetPassword);
router.get("/is-auth", userAuth, userController.isAuthenticated);
router.post("/forgot-password", authController.forgotPassword);
router.post('/resend-otp', authController.resendOTP);
router.post("/reset-password/:token", authController.resetPassword);

export default router;
