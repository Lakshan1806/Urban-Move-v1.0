import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetotp} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter=express.Router();
authRouter.post("/register",register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetotp);
authRouter.post('/reset-password',resetPassword);
  

export default authRouter;

