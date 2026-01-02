import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(tokenDecode.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found - please login again",
        });
      }

      if (user.isTerminated) {
        return res.status(403).json({
          success: false,
          message: "Account terminated - please contact support",
        });
      }
      console.log("Auth check successful for user:", user._id);

      req.user = user;
      req.userId = tokenDecode.id; 
      req.body.userId = tokenDecode.id;
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

export default userAuth;
