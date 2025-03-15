import express from 'express'
import userAuthMiddleware from '../middleware/userAuth.js';
import  {getUserData} from '../controllers/userController.js';

const userRouter=express.Router();

userRouter.get('/data', userAuthMiddleware, getUserData)

export default userRouter;