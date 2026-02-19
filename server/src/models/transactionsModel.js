import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarbonCredit",
    required: true,
    index: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  pricePerCredit: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ["card", "upi", "other"],
    default: "other",
  },
  transactionHash: { type: String },
  // Blockchain-specific fields
  blockchainTxHash: { type: String, index: true },
  blockchainStatus: {
    type: String,
    enum: ["pending", "confirmed", "failed", "not_on_chain"],
    default: "not_on_chain",
  },
  blockNumber: { type: Number },
  smartContractReceipt: { type: Object },
  purchaseDate: { type: Date, default: Date.now, index: true },
  completedAt: { type: Date },
});

export default mongoose.model("Transaction", transactionSchema);
