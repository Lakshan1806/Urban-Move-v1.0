import express from "express";

// Reuse existing user auth flows until dedicated controllers are split out.
import userRoutes from "#modules/users/routes/userRoute.js";

const authRouter = express.Router();

authRouter.use("/", userRoutes);

export default authRouter;
