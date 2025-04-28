import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";
import passport from "passport";
import generateJwtToken from "../utils/generateJWTToken.js";
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
router.put("/updateprofile", userAuth, userController.updateProfile);
router.put("/profile/password", userAuth, userController.changePassword);

router.get(
  "/google",
  (req, res, next) => {
    req.session.googleAuthIntent = req.query.intent || "login";
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (user.isAccountVerified) {
        const token = generateJwtToken(user._id, user.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        return res.redirect(`${process.env.FRONTEND_URL}`);
      }

      req.session.tempUser = {
        googleId: user.googleId,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        authMethod: "google",
      };

      req.session.save();

      res.redirect(
        `${process.env.FRONTEND_URL}/verify-phone?authMethod=google`
      );
    } catch (error) {
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
      );
    }
  }
);

router.post("/google/verify-phone", userController.verifyGooglePhone);

export default router;
