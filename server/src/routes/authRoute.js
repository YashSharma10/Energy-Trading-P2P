import express from "express";
import {
  register,
  verifyOTP,
  login,
  profile,
  updateProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
} from "../validators/authValidator.js";
import { rateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// Rate limiting: 5 attempts per 15 minutes
router.post("/register", validate(registerSchema), rateLimiter(5, 15 * 60 * 1000, "register"), register);
router.post("/verify-otp", validate(verifyOTPSchema), rateLimiter(3, 15 * 60 * 1000, "verify-otp"), verifyOTP);
router.post("/login", validate(loginSchema), rateLimiter(5, 15 * 60 * 1000, "login"), login);
router.get("/profile", authMiddleware, profile);
router.patch("/profile", authMiddleware, updateProfile);

export default router;
