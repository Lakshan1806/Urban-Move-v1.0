import express from "express";
import userController from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();
authRouter.post("/register", userController.register);
authRouter.post("/login", userController.login);
authRouter.post("/logout", userController.logout);
authRouter.post("/reset-password", userController.resetPassword);
authRouter.get("/is-auth", userAuth, userController.isAuthenticated);

export default authRouter;
