import express from 'express';
import { sendOtp, OTPVerification, updateRefreshTokens, logout } from '../controllers/otpController.js';
import { activateUser } from '../controllers/activateController.js';
import { accessTokenMiddleware } from '../middlewares/authmiddleware.js';

const router = express.Router(); 

router.post("/send-otp",sendOtp);
router.post("/verify-otp",OTPVerification);
router.post("/activate",accessTokenMiddleware,activateUser);
router.get("/refresh", updateRefreshTokens);
router.post("/logout",logout);

export default router;