import express from 'express'
import { getUserData } from '../controller/userController.js';
import userAuth from '../middleware/userauth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData)

export default userRouter;