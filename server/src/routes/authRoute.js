import express from "express";
import passport from "../config/passport.js";
import {
  register,
  verifyOTP,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
  googleAuthCallback,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/authValidator.js";
import { rateLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// ─── Email / Password Auth ────────────────────────────────────────────────────
// Rate limiting: 5 attempts per 15 minutes
router.post("/register", validate(registerSchema), rateLimiter(5, 15 * 60 * 1000, "register"), register);
router.post("/verify-otp", validate(verifyOTPSchema), rateLimiter(3, 15 * 60 * 1000, "verify-otp"), verifyOTP);
router.post("/login", validate(loginSchema), rateLimiter(5, 15 * 60 * 1000, "login"), login);
router.post("/forgot-password", validate(forgotPasswordSchema), rateLimiter(3, 15 * 60 * 1000, "forgot-password"), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), rateLimiter(3, 15 * 60 * 1000, "reset-password"), resetPassword);
router.get("/profile", authMiddleware, profile);
router.patch("/profile", authMiddleware, updateProfile);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// 1. Redirect user to Google consent screen
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// 2. Google redirects back here after consent
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  googleAuthCallback
);

export default router;
