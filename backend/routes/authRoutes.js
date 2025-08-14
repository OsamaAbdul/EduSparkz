import express from 'express';
import { Router } from 'express';
import { login, register} from '../controllers/UserController.js'
import {loginLimiter} from '../helper/rateLimit.js'

const router = Router();




router.post('/login', loginLimiter, login);
router.post('/register', register);


export default router;