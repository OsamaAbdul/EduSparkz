import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // block after 5 requests
  message: { error: "Too many login attempts. Please try again in 15minutes." }
});
