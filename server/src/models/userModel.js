import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  company: { type: String, default: "" },
  phone: { type: String, default: "" },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  totalCredits: { type: Number, default: 0 },
  totalSpents: { type: Number, default: 0 },
  posted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarbonCredit",
    },
  ],
  seen: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarbonCredit",
    },
  ],
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const expiry = process.env.TOKEN_EXPIRY || "7d";
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: expiry,
  });
};

export default mongoose.model("User", userSchema);
