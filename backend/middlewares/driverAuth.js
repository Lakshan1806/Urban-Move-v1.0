import jwt from "jsonwebtoken";
import driverModel from "../models/driver.models.js";

const driverAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    const driver = await driverModel.findById(tokenDecode.id);

    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "driver not found - please login again",
      });
    }

    if (driver.isTerminated) {
      return res.status(403).json({
        success: false,
        message: "Account terminated - please contact support",
      });
    }
    console.log("Auth check successful for driver:", driver._id);

    req.driver = driver;
    req.body.driverId = tokenDecode.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", {
      error: error.message,
      stack: error.stack,
      tokenPresent: !!req.cookies.token,
    });
    let message = "Authentication failed";
    if (error.name === "TokenExpiredError") {
      message = "Session expired - please login again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token - please login again";
    }

    return res.status(401).json({
      success: false,
      message: message || error.message,
    });
  }
};

export default driverAuth;
