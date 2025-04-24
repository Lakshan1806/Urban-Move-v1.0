import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/profile", userAuth, userController.getUserProfile);
router.post("/reset-password", userController.resetPassword);
router.get("/is-auth", userAuth, userController.isAuthenticated);
router.post("/forgot-password", userController.forgotPassword);
router.post("/resend-otp", userController.resendOTP);
router.post("/reset-password/:token", userController.resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .redirect("http://localhost:5173");
  }
);

export default router;
