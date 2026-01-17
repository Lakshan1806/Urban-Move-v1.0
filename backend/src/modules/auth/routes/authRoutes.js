import {Router} from "express";

// Reuse existing user auth flows until dedicated controllers are split out.
//import userRoutes from "#modules/users/routes/userRoute.js";
export const mountPath = "/auth";

const authRouter = Router();

//authRouter.post("/login", adminController.auth.login);
//authRouter.post("/logout", adminController.auth.logout);

export default authRouter;
