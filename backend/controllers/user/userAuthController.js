import {
  saveToSession,
  clearFromSession,
  getFromSession,
} from "../../utils/sessionHelpers.js";
import { handleErrors, validationError } from "../../utils/errorHandler.js";
import otpService from "../../services/otpService.js";
import userService from "../../services/userService.js";
import generateJwtToken from "../../utils/generateJWTToken.js";
import nodemailer from "../../utils/nodemailer.js";
import userModel from "../../models/usermodel.js";
import bcrypt from "bcrypt";
import driverModel from "../../models/driver.models.js";

const SESSION_REGISTRATION_KEY = "registration";
const SESSION_LOGIN_KEY = "loginProcess";

const userAuthController = {
  createAuthController: (Model, role, SESSION_REGISTRATION_KEY) => ({
    startRegistration: async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return validationError(res, "Username and password are required");
        }

        const existing = await Model.findOne({ username });
        if (existing)
          return res.status(400).json({ message: `${role} already exists` });

        await saveToSession(req.session, SESSION_REGISTRATION_KEY, {
          username,
          password,
        });

        return res.json({
          success: true,
          message: "Please provide your phone number",
          nextStep: "phone",
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    addPhoneNumber: async (req, res) => {
      try {
        const { phoneNumber } = req.body;
        const registration = getFromSession(
          req.session,
          SESSION_REGISTRATION_KEY
        );

        if (!registration || !registration.username) {
          return validationError(
            res,
            "Registration session expired. Please start again."
          );
        }

        const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
        if (!phoneRegex.test(phoneNumber)) {
          return validationError(res, "Invalid phone number format");
        }

        if (await Model.findOne({ phone: phoneNumber })) {
          return validationError(res, "Phone number already registered");
        }

        await otpService.sendOtp("phone", phoneNumber);

        await saveToSession(req.session, SESSION_REGISTRATION_KEY, {
          ...registration,
          phoneNumber,
        });

        return res.json({
          success: true,
          message: "OTP sent to phone number",
          nextStep: "verify-phone",
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    verifyPhoneOtp: async (req, res) => {
      try {
        const { otp } = req.body;
        const registration = getFromSession(
          req.session,
          SESSION_REGISTRATION_KEY
        );

        if (!registration?.phoneNumber) {
          return validationError(res, "Phone number not found in session");
        }

        const { isValid, message } = await otpService.validateOtp(
          "phone",
          registration.phoneNumber,
          otp
        );

        if (!isValid) {
          return validationError(res, message || "Invalid OTP");
        }

        await saveToSession(req.session, SESSION_REGISTRATION_KEY, {
          ...registration,
          phoneVerified: true,
        });

        return res.json({
          success: true,
          message: "Phone number verified",
          nextStep: "email",
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    addEmail: async (req, res) => {
      try {
        const { email } = req.body;
        const registration = getFromSession(
          req.session,
          SESSION_REGISTRATION_KEY
        );

        if (!registration?.phoneVerified) {
          return validationError(res, "Phone verification required first");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return validationError(res, "Invalid email format");
        }

        if (await Model.findOne({ email })) {
          return validationError(res, "Email already registered");
        }

        await otpService.sendOtp("email", email);

        await saveToSession(req.session, SESSION_REGISTRATION_KEY, {
          ...registration,
          email,
        });

        return res.json({
          success: true,
          message: "OTP sent to email",
          nextStep: "verify-email",
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    verifyEmailOtp: async (req, res) => {
      try {
        const { otp } = req.body;
        const registration = getFromSession(
          req.session,
          SESSION_REGISTRATION_KEY
        );

        if (!registration?.email) {
          return validationError(res, "Email not found in session");
        }

        const { isValid, message } = await otpService.validateOtp(
          "email",
          registration.email,
          otp
        );

        if (!isValid) {
          return validationError(res, message || "Invalid OTP");
        }
        if (role === "driver") {
          await saveToSession(req.session, SESSION_REGISTRATION_KEY, {
            ...registration,
            emailVerified: true,
            
          });

          return res.json({
            success: true,
            message: "Email verified. Please upload documents.",
            nextStep: "upload-documents",
          });
        }

        const user = await Model.create({
          username: registration.username,
          password: registration.password,
          phone: registration.phoneNumber,
          email: registration.email,
          isAccountVerified: true,
        });

        const token = generateJwtToken(user._id, user.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000, // 1 hour
          path: "/",
        });

        await clearFromSession(req.session, SESSION_REGISTRATION_KEY);

        nodemailer
          .sendEmail(
            user.email,
            "Welcome to Our Service",
            "Your account has been successfully created!"
          )
          .catch((err) => console.error("Error sending welcome email:", err));

        return res.json({
          success: true,
          message: "Registration successful",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
          },
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },
    uploadDocuments: async (req, res) => {
      try {
        const registration = getFromSession(
          req.session,
          SESSION_REGISTRATION_KEY
        );

        if (!registration?.email) {
          return validationError(
            res,
            "Registration session expired or incomplete"
          );
        }

        if (!req.files || req.files.length === 0) {
          return validationError(res, "No documents uploaded");
        }

        const documentPaths = req.files.map((file) =>
          file.path.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
        );

        await saveToSession(req.session, SESSION_REGISTRATION_KEY, {
          ...registration,
          documentsUploaded: true,
        });

        
        const driver = await Model.create({
          username: registration.username,
          password: registration.password,
          phone: registration.phoneNumber,
          email: registration.email,
          isAccountVerified: true,
          driverDocuments: documentPaths,
          driverVerified: "pending",
        });

        const token = generateJwtToken(driver._id, driver.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
          path: "/",
        });

        await clearFromSession(req.session, SESSION_REGISTRATION_KEY);

        return res.json({
          success: true,
          message: "Driver registration submitted. Pending admin verification.",
          driver: {
            id: driver._id,
            username: driver.username,
            email: driver.email,
            phone: driver.phone,
            driverVerified: driver.driverVerified,
          },
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    resendOtp: async (req, res) => {
      try {
        const { type } = req.body;
        const registration = getFromSession(
          req.session,
          SESSION_REGISTRATION_KEY
        );

        if (!registration) {
          return validationError(res, "Registration session expired");
        }

        let identifier;
        if (type === "phone") {
          if (!registration.phoneNumber) {
            return validationError(res, "Phone number not provided yet");
          }
          identifier = registration.phoneNumber;
        } else if (type === "email") {
          if (!registration.email) {
            return validationError(res, "Email not provided yet");
          }
          identifier = registration.email;
        } else {
          return validationError(res, "Invalid OTP type");
        }

        await otpService.resendOtp(type, identifier);

        return res.json({
          success: true,
          message: `OTP resent to ${type}`,
          nextStep: `verify-${type}`,
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },
    getProcess: async (req, res) => {
      const registration = req.session.registration || {};

      const response = {
        username: registration.username,
        phone: registration.phoneNumber,
        phoneVerified: registration.phoneVerified,
        email: registration.email,
        emailVerified: registration.emailVerified,
      };

      if (!registration.username) {
        return res.json({ status: "new", nextStep: "start" });
      }
      if (!registration.phoneNumber) {
        return res.json({
          status: "in-progress",
          nextStep: "phone",
          ...response,
        });
      }
      if (!registration.phoneVerified) {
        return res.json({
          status: "in-progress",
          nextStep: "verify-phone",
          ...response,
        });
      }
      if (!registration.email) {
        return res.json({
          status: "in-progress",
          nextStep: "email",
          ...response,
        });
      }
      if (!registration.emailVerified) {
        return res.json({
          status: "in-progress",
          nextStep: "verify-email",
          ...response,
        });
      }
      if (role === "driver" && !registration.documentsUploaded) {
        return res.json({
          status: "in-progress",
          nextStep: "upload-documents",
          ...response,
        });
      }
      return res.json({ status: "complete", ...response });
    },
    registerAsDriverController: async (req, res) => {
      try {
        const userId = req.user._id;

        // Check if user already has a driver profile
        const existingDriver = await Model.findOne({ user: userId });
        if (existingDriver) {
          return res
            .status(400)
            .json({ message: "You have already registered as a driver." });
        }

        if (!req.files || req.files.length === 0) {
          return validationError(res, "No documents uploaded");
        }

        const documentPaths = req.files.map((file) =>
          file.path.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
        );

        const newDriver = new Model({
          user: userId,
          driverDocuments: documentPaths,
          driverVerified: "pending",
          isAccountVerified: true,
        });

        await newDriver.save();

        return res
          .status(201)
          .json({ message: "Driver profile submitted for approval." });
      } catch (err) {
        console.error("Error in registerAsDriver:", err);
        return res.status(500).json({ message: "Something went wrong." });
      }
    },
    isAuthenticated: async (req, res) => {
    try {
      if (req.body.userId) {
        const user = await Model
          .findById(req.body.userId)
          .select("-password -__v");
        return res.json({ success: true, user });
      }
      return validationError(res, "Not authenticated", 401);
    } catch (error) {
      handleErrors(res, error);
    }
  },
  }),
  login: {
    verifyCredentials: async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return validationError(res, "Username and password are required");
        }

        const user = await userService.findByUsername(username);

        if (!user) {
          return validationError(res, "Invalid credentials");
        }

        if (user.authMethod === "google") {
          return validationError(res, "Please sign in with Google", {
            authMethod: "google",
          });
        }

        if (user.isTerminated) {
          return validationError(
            res,
            "Account terminated - please contact support"
          );
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
          return validationError(res, "Invalid credentials");
        }

        await saveToSession(req.session, SESSION_LOGIN_KEY, {
          userId: user._id,
          username: user.username,
          step: "verify-phone",
        });

        return res.json({
          success: true,
          message: "Please verify your phone number",
          nextStep: "verify-phone",
          user: {
            id: user._id,
            username: user.username,
          },
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    verifyPhone: async (req, res) => {
      try {
        const { phoneNumber } = req.body;
        const loginData = getFromSession(req.session, SESSION_LOGIN_KEY);

        if (!loginData?.userId) {
          return validationError(res, "Session expired - please login again");
        }

        if (!phoneNumber) {
          return validationError(res, "Phone number is required");
        }

        const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
        if (!phoneRegex.test(phoneNumber)) {
          return validationError(res, "Invalid phone number format");
        }

        const user = await userService.findById(loginData.userId);
        if (!user) {
          await clearFromSession(req.session, SESSION_LOGIN_KEY);
          return validationError(res, "User not found");
        }

        if (user.phone !== phoneNumber) {
          return validationError(res, "Phone number doesn't match our records");
        }

        await otpService.sendOtp("phone", phoneNumber);

        await saveToSession(req.session, SESSION_LOGIN_KEY, {
          ...loginData,
          phoneNumber,
          step: "verify-otp",
        });

        return res.json({
          success: true,
          message: "OTP sent to your phone",
          nextStep: "verify-otp",
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    verifyOtp: async (req, res) => {
      try {
        const { otp } = req.body;
        const loginData = getFromSession(req.session, SESSION_LOGIN_KEY);

        if (!loginData?.phoneNumber) {
          return validationError(res, "Session expired - please login again");
        }

        if (!otp) {
          return validationError(res, "OTP is required");
        }

        const { isValid, message } = await otpService.validateOtp(
          "phone",
          loginData.phoneNumber,
          otp
        );

        if (!isValid) {
          return validationError(res, message || "Invalid OTP");
        }

        const user = await userService.findById(loginData.userId);
        if (!user) {
          await clearFromSession(req.session, SESSION_LOGIN_KEY);
          return validationError(res, "User not found");
        }

        const token = generateJwtToken(user._id, user.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000, // 1 hour
          path: "/",
        });

        await clearFromSession(req.session, SESSION_LOGIN_KEY);

        return res.json({
          success: true,
          message: "Login successful",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
          token,
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    getProgress: async (req, res) => {
      try {
        const loginData = getFromSession(req.session, SESSION_LOGIN_KEY) || {};

        const response = {
          userId: loginData.userId,
          username: loginData.username,
          phoneNumber: loginData.phoneNumber,
          currentStep: loginData.step || "credentials",
        };

        if (!loginData.userId) {
          return res.json({
            status: "new",
            nextStep: "verify-credentials",
          });
        }

        if (!loginData.phoneNumber) {
          return res.json({
            status: "in-progress",
            nextStep: "verify-phone",
            ...response,
          });
        }

        if (loginData.step === "verify-otp") {
          return res.json({
            status: "in-progress",
            nextStep: "verify-otp",
            ...response,
          });
        }

        return res.json({
          status: "complete",
          ...response,
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },

    resendOtp: async (req, res) => {
      try {
        const loginData = getFromSession(req.session, SESSION_LOGIN_KEY);

        if (!loginData?.phoneNumber) {
          return validationError(res, "Session expired - please login again");
        }

        await otpService.resendOtp("phone", loginData.phoneNumber);

        return res.json({
          success: true,
          message: "OTP resent to your phone",
          nextStep: "verify-otp",
        });
      } catch (error) {
        handleErrors(res, error);
      }
    },
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      req.session.destroy((err) => {
        if (err) {
          handleErrors(res, err, "Failed to destroy session");
          return;
        }
        res.json({ success: true, message: "Logout successful!" });
      });
    } catch (error) {
      handleErrors(res, error, "Server error during logout");
    }
  },

  
  verifyGooglePhone: async (req, res) => {
    try {
      const tempUser = getFromSession(req.session, "tempUser");
      if (!tempUser?.googleId) {
        return validationError(res, "Google signup session expired");
      }

      const { phoneNumber, otp } = req.body;

      if (!phoneNumber && !otp) {
        return validationError(res, "Phone number or OTP is required");
      }

      if (phoneNumber && !otp) {
        const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
        if (!phoneRegex.test(phoneNumber)) {
          return validationError(res, "Invalid phone number format");
        }

        if (await userService.userExists("phone", phoneNumber)) {
          return validationError(res, "Phone number already exists");
        }

        await saveToSession(req.session, "tempUser", {
          ...tempUser,
          phoneNumber,
        });

        await otpService.sendOtp("phone", phoneNumber);

        return res.json({
          success: true,
          message: "OTP sent to phone",
        });
      }

      if (otp) {
        if (!tempUser.phoneNumber) {
          return validationError(res, "Phone number not found in session");
        }

        const { isValid } = await otpService.validateOtp(
          "phone",
          tempUser.phoneNumber,
          otp
        );

        if (!isValid) {
          return validationError(res, "Invalid or expired OTP");
        }

        const updatedUser = await userModel.findOneAndUpdate(
          { googleId: tempUser.googleId },
          {
            phone: tempUser.phoneNumber,
            isAccountVerified: true,
          },
          { new: true }
        );

        const token = generateJwtToken(updatedUser._id, updatedUser.username);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600000,
        });

        await clearFromSession(req.session, "tempUser");

        return res.json({
          success: true,
          message: "Phone verification successful",
          user: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            authMethod: updatedUser.authMethod,
          },
        });
      }

      return validationError(res, "Invalid request");
    } catch (error) {
      handleErrors(res, error);
    }
  },
};
export default userAuthController;
