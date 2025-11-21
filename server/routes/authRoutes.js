import express from 'express'
import { isAuth, login, logout, register, resetPass, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controller/authController.js';
import userAuth from '../middleware/userauth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-authed', userAuth, isAuth);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPass);
export default authRouter;