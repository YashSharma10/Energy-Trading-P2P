import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import sendMail from "../utils/mailer.js";
import logger from "../utils/logger.js";
import config from "../config/index.js";

const isDevelopment = config.nodeEnv === "development";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // In development mode without email config, auto-verify users
    const autoVerify = isDevelopment && (!config.email.user || config.email.user === "your-email@gmail.com");

    const newUser = new User({ 
      email, 
      password,
      isVerified: autoVerify // Auto-verify in development without email config
    });
    await newUser.save();

    if (autoVerify) {
      logger.info(`[DEV MODE] User ${email} auto-verified (email not configured)`);
      return res.status(201).json({ 
        success: true,
        message: "Registration successful. Account auto-verified for development.",
        autoVerified: true
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await new OTP({ email, otp, expiresAt }).save();
    await sendMail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.status(201).json({ 
      success: true,
      message: "Registration successful. OTP sent to your email.",
      expiresIn: "10 minutes"
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, company, phone } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (phone !== undefined) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`Profile updated for user ${userId}`);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    logger.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return res.status(400).json({ 
        success: false,
        message: "No OTP found. Please request a new one." 
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired. Please request a new one." 
      });
    }

    // Check if max attempts reached
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false,
        message: "Maximum verification attempts exceeded. Please request a new OTP." 
      });
    }

    // Verify OTP
    const isValid = await otpRecord.verifyOTP(otp);
    
    if (!isValid) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      const attemptsLeft = 3 - otpRecord.attempts;
      return res.status(400).json({ 
        success: false,
        message: `Invalid OTP. ${attemptsLeft} attempt(s) remaining.`,
        attemptsLeft 
      });
    }

    // OTP is valid - verify user and clean up
    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteMany({ email }); // Delete all OTPs for this email

    res.json({ 
      success: true,
      message: "Email verified successfully" 
    });
  } catch (error) {
    logger.error("Error verifying OTP:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to verify OTP" 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: "Please verify your email first" 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();

    res.json({ 
      success: true,
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Login failed" 
    });
  }
};

export const profile = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.userId).select("-password");
    
    if (!userDetails) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    return res.json({ 
      success: true,
      user: userDetails 
    });
  } catch (error) {
    logger.error("Error fetching profile:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch profile" 
    });
  }
};

