import express from 'express';
import { Router } from 'express';
import { login, register, verifyOtp, resendOtp} from '../controllers/UserController.js'
import {loginLimiter} from '../helper/rateLimit.js'

const router = Router();




router.post('/login',  login);
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

export default router;