import dotenv from "dotenv";

dotenv.config();

const config = {
  // Server Configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/carbonEase",
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    expiry: process.env.JWT_EXPIRY || "7d",
  },

  // Email Configuration
  email: {
    service: "gmail",
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
    from: process.env.EMAIL_FROM || "noreply@carbonease.com",
  },

  // Rate Limiting
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // OTP Configuration
  otp: {
    expiryMinutes: 10,
    maxAttempts: 3,
  },

  // Pagination Defaults
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
};

export default config;
