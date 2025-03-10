import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";
import Client from "../utils/twilioClient.js";
import otp from "../models/otpModels.js";
import userModel from "../models/usermodel.js";

dotenv.config({
  path: "C:/Users/USER/Videos/Software-Development-Project/.env",
});

export const register = async (req, res) => {
  console.log("Incoming request:", req.body); //  Log request body
  console.log("Session data before processing:", req.session); // Log session details
  // Ensure session object exists
  if (!req.session) {
    console.log("Session is undefined");
    return res.status(500).json({ message: "Session is not initialized" });
  }

  // Ensure tempUser is initialized
  if (!req.session.tempUser) {
    req.session.tempUser = {}; // Initialize if not set
  }

  try {
    // Destructure all variables coming from the body
    const {
      username,
      password,
      phoneNumber,
      otp: phoneOTP,
      email,
      emailOTP,
    } = req.body;

    // Check session to determine which step the user is at
    let userSession = req.session.tempUser || {};

    // Step 1: Handle username and password
    if (!userSession.username && !userSession.password) {
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and Password are required" });
      }

      // Check if username exists
      const existingUser = await userModel.findOne({ username });
      if (existingUser)
        return res.status(400).json({ message: "Username already exists" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save username and password temporarily in session
      req.session.tempUser = { username, password: hashedPassword };

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res
            .status(500)
            .json({ message: "Server error", error: "Session not saved" });
        }
        return res.status(200).json({
          message: "Step 1 complete. Please enter your phone number.",
        });
      });

      return; 
    }
    // Step 2: Handle phone number and OTP
    console.log("Session tempUser data at Step 2:", req.session.tempUser);
    if (userSession.username && !userSession.phoneNumber) {
      if (!userSession.username) {
        console.error("Session data missing at Step 2:", req.session);
        return res.status(400).json({
          message: "Session data is missing. Please start from Step 1.",
        });
      }

      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required" });
      }

      // Check if phone number exists
      const existingPhone = await userModel.findOne({ phone: phoneNumber });
      if (existingPhone)
        return res.status(400).json({ message: "Phone number already exists" });

      // Generate and send OTP for phone number
      const generatedPhoneOTP = String(
        Math.floor(100000 + Math.random() * 900000)
      );
      const expiryPhoneOtp = Date.now() + 15 * 60 * 1000;
      await otp.create({
        phone: phoneNumber,
        otp: generatedPhoneOTP,
        expiresAt: expiryPhoneOtp,
      });

      // Send OTP via SMS

      await Client.messages
        .create({
          body: `Your OTP for Cab Booking System is: ${generatedPhoneOTP}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        })
        .then((message) =>
          console.log("Message sent successfully! SID:", message.sid)
        )
        .catch((error) => console.error("Failed to send SMS:", error.message));

      // Save phone number temporarily in session
      req.session.tempUser.phoneNumber = phoneNumber;

      // Save session to persist data
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res
            .status(500)
            .json({ message: "Server error", error: "Session not saved" });
        }
        return res
          .status(200)
          .json({ message: "OTP sent to phone. Please verify." });
      });
      return;
    }

    // Step 3: Handle OTP validation for phone number

    if (
      userSession.username &&
      userSession.phoneNumber &&
      !userSession.phoneVerified
    ) {
      if (!phoneOTP) {
        return res.status(400).json({ message: "Phone OTP is required" });
      }

      // Check if OTP matches
      const otpRecord = await otp.findOne({
        phone: userSession.phoneNumber,
        otp: phoneOTP,
      });
      if (!otpRecord || otpRecord.expiresAt < Date.now()) {
        return res
          .status(400)
          .json({ message: "Invalid or expired phone OTP" });
      }

      userSession.phoneVerified = true;

      await req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res
            .status(500)
            .json({ message: "Server error", error: "Session not saved" });
        }
        return res.status(200).json({
          message: "Phone number verified. Please enter your email address.",
        });
      });
      return;
    }

    // Step 4: Handle email and OTP
    if (
      userSession.username &&
      userSession.phoneVerified &&
      !userSession.email
    ) {
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const existingEmail = await userModel.findOne({ email });
      if (existingEmail)
        return res.status(400).json({ message: "Email already exists" });

      // Generate and send OTP for email address
      const generatedEmailOTP = String(
        Math.floor(100000 + Math.random() * 900000)
      );
      const expiryEmailOtp = Date.now() + 15 * 60 * 1000;
      await otp.create({
        phone: userSession.phoneNumber,
        email,
        otp: generatedEmailOTP,
        expiresAt: expiryEmailOtp,
      });

      // Send OTP via email (implement this function)
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${generatedEmailOTP}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email OTP sent successfully!");
      } catch (error) {
        console.error("Failed to send email OTP:", error.message);
        return res.status(500).json({
          message: "Failed to send OTP via email",
          error: error.message,
        });
      }

      req.session.tempUser.email = email;

      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res
            .status(500)
            .json({ message: "Server error", error: "Session not saved" });
        }
        return res
          .status(200)
          .json({ message: "OTP sent to email. Please verify." });
      });
      return;
    }

    // Step 5: Handle OTP validation for email
    console.log("Session data before verifying OTP:", req.session.tempUser);

    if (
      userSession.username &&
      userSession.phoneVerified &&
      userSession.email &&
      !userSession.emailVerified
    ) {
      if (!emailOTP) {
        return res.status(400).json({ message: "Email OTP is required" });
      }

      // Check if email OTP matches
      const emailOTPRecord = await otp.findOne({
        email: userSession.email,
        otp: emailOTP,
      });
      if (!emailOTPRecord || emailOTPRecord.expiresAt < Date.now()) {
        return res
          .status(400)
          .json({ message: "Invalid or expired email OTP" });
      }

      userSession.emailVerified = true;

      // Now, create the user in the database
      const newUser = new userModel({
        username: userSession.username,
        password: userSession.password,
        phone: userSession.phoneNumber,
        email: userSession.email,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Clear session data after registration is complete
      req.session.tempUser = null;

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: newUser.email,
        subject: "Welcome to the Cab Booking System",
        text: `Registration successful`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("successful send message in email");
      } catch (error) {
        console.error( error.message);
        return res.status(500).json({
          message: "Failed to send  email",
          error: error.message,
        });
      }

      return res
        .status(201)
        .json({ message: "Registration successful!", token });
    }

    // If all steps are complete or no progress is made
    return res
      .status(400)
      .json({ message: "Unexpected state of registration process." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and passward are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// user logot
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send password reset otp
export const sendResetotp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification Otp",
      text: `Your otp for resetting your password is ${otp}.
      use this otp to proceed with resetting your password.`,
    };
    transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset your user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user is not found" });
    }
    if (user.resetOtp === "" || user.resetOtp != otp) {
      return res.json({ success: false, message: "Invalid otp" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Otp Expired" });
    }

    const hashedpassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedpassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "password has been reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
