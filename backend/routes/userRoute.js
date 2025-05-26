import express from "express";
import feedbackController from "../controllers/rent/feedbackController.js";
import rentalController from "../controllers/rent/rentalController.js";
import getAvailableCars from "../controllers/caroptionsController.js";
import userController from "../controllers/user/userController.js";
import userAuth from "../middlewares/userAuth.js";
import passport from "passport";
import generateJwtToken from "../utils/generateJWTToken.js";
import dotenv from "dotenv";
import sendOtp from "../utils/sendOtp.js";
import validateOtp from "../utils/validateOtp.js";
import otpModel from "../models/otpModels.js";
import userUpload from "../middlewares/userMulter.js";
import { validateRegistrationStep } from "../middlewares/registrationMiddleware.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import driverUpload from "../middlewares/driverUpload.js";
import userModel from "../models/usermodel.js";
import driverModel from "../models/driver.models.js";
import driverAuth from "../middlewares/driverAuth.js";

dotenv.config();

const userRoutes = express.Router();

const userregisterController = userController.auth.createAuthController(
  userModel,
  "user",
  "registration"
);

userRoutes.post("/logout", userController.auth.logout);
userRoutes.post("/google/verify-phone", userController.auth.verifyGooglePhone);
userRoutes.post("/forgot-password", userController.password.forgotPassword);
userRoutes.get("/is-auth", userAuth, userregisterController.isAuthenticated);

userRoutes.post("/register/start", userregisterController.startRegistration);
userRoutes.post(
  "/register/phone",
  validateRegistrationStep("phone"),
  userregisterController.addPhoneNumber
);
userRoutes.post(
  "/register/verify-phone",
  validateRegistrationStep("verify-phone"),
  userregisterController.verifyPhoneOtp
);
userRoutes.post(
  "/register/email",
  validateRegistrationStep("email"),
  userregisterController.addEmail
);
userRoutes.post(
  "/register/verify-email",
  validateRegistrationStep("verify-email"),
  userregisterController.verifyEmailOtp
);
userRoutes.get("/register/progress", userregisterController.getProcess);
userRoutes.post("/register/resend-otp", userregisterController.resendOtp);
userRoutes.post(
  "/reset-password/:token",
  userController.password.resetPassword
);
/* userRoutes.post("register/upload-documents",  validateRegistrationStep("upload-documents"),
 driverUpload.array("documents", 5),userController.auth.register.uploadDocuments); */

const driverregisterController = userController.auth.createAuthController(
  driverModel,
  "driver",
  "registration"
);
userRoutes.get("/is-dauth", driverAuth, userregisterController.isAuthenticated);

userRoutes.post("/dregister/start", driverregisterController.startRegistration);
userRoutes.post(
  "/dregister/phone",
  validateRegistrationStep("phone"),
  driverregisterController.addPhoneNumber
);
userRoutes.post(
  "/dregister/verify-phone",
  validateRegistrationStep("verify-phone"),
  driverregisterController.verifyPhoneOtp
);
userRoutes.post(
  "/dregister/email",
  validateRegistrationStep("email"),
  driverregisterController.addEmail
);
userRoutes.post(
  "/dregister/verify-email",
  validateRegistrationStep("verify-email"),
  driverregisterController.verifyEmailOtp
);
userRoutes.get("/dregister/progress", driverregisterController.getProcess);
userRoutes.post("/dregister/resend-otp", driverregisterController.resendOtp);

userRoutes.post(
  "/dregister/upload-documents",
  validateRegistrationStep("upload-documents"),
  driverUpload.array("documents", 5),
  driverregisterController.uploadDocuments
);
userRoutes.put(
  "/profile/password",
  userAuth,
  userController.password.changePassword
);
userRoutes.get("/profile", userAuth, userController.profile.getUserProfile);
userRoutes.post(
  "/updateprofile",
  userAuth,
  userUpload.single("photo"),
  userController.profile.updateProfile
);
userRoutes.delete(
  "/delete-account",
  userAuth,
  userController.profile.deleteAccount
);

userRoutes.get(
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

userRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (req.user.isTerminated) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=account_terminated`
        );
      }
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

userRoutes.post("/register/clear-session", (req, res) => {
  req.session.registration = null;
  res.json({ success: true, message: "Registration session cleared" });
});

userRoutes.post(
  "/login/verify-credentials",
  validateRequest(["username", "password"]),
  userController.auth.login.verifyCredentials
);
userRoutes.post(
  "/login/verify-phone",
  validateRequest(["phoneNumber"]),
  userController.auth.login.verifyPhone
);
userRoutes.post(
  "/login/verify-otp",
  validateRequest(["otp"]),
  userController.auth.login.verifyOtp
);
userRoutes.post("/login/resend-otp", userController.auth.login.resendOtp);
userRoutes.get("/login/progress", userController.auth.login.getProgress);

userRoutes.post("/send-otp", async (req, res) => {
  console.log("OTP request received:", req.body);

  try {
    const { type, phone, email, userId } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    if (type === "phone" && !phone) {
      return res
        .status(400)
        .json({ message: "Phone is required for phone OTP" });
    }

    if (type === "email" && !email) {
      return res
        .status(400)
        .json({ message: "Email is required for email OTP" });
    }

    await sendOtp(req, res);
  } catch (error) {
    console.error("Route handler error:", error);

    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
});

userRoutes.post("/verify-otp", async (req, res) => {
  try {
    const { type, phone, email, otp } = req.body;
    const identifier = type === "phone" ? phone : email;

    const result = await validateOtp(type, identifier, otp, otpModel);
    if (!result.isValid) {
      return res.status(400).json({ message: result.message });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
});

// Create a new rental
//userRoutes.post('/', rentalController.createRental);

// Get all rentals
//userRoutes.get('/', rentalController.getAllRentals);

// Get a single rental by ID
//userRoutes.get('/:id', rentalController.getRentalById);

// Update a rental
//userRoutes.put('/:id', rentalController.updateRental);

// Delete a rental
//userRoutes.delete('/:id', rentalController.deleteRental);

userRoutes.post("/submit", feedbackController.submit);

userRoutes.get("/slideshow_images", rentalController.fetchSlideshowImage);

userRoutes.get("/availableCars", getAvailableCars);

export default userRoutes;
