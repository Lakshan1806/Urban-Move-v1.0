import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/reset-password", userController.resetPassword);
router.get("/is-auth", userAuth, userController.isAuthenticated);
router.post("/forgot-password", userController.forgotPassword);
router.post('/resend-otp', userController.resendOTP);
router.post("/reset-password/:token", userController.resetPassword);


export default router;
