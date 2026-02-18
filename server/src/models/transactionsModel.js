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
    enum: ["card", "upi", "blockchain", "other"],
    default: "other",
  },
  transactionHash: { type: String },
  purchaseDate: { type: Date, default: Date.now, index: true },
  completedAt: { type: Date },
  
  // Blockchain-specific fields
  blockchain: {
    enabled: { type: Boolean, default: false },
    chainId: { type: Number }, // Ethereum chain ID
    contractAddress: { type: String }, // Smart contract address
    transactionHash: { type: String }, // Blockchain TX hash
    blockNumber: { type: Number }, // Block number
    gasUsed: { type: String }, // Gas used for transaction
    buyerWallet: { type: String }, // Buyer's wallet address
    sellerWallet: { type: String }, // Seller's wallet address
    blockchainTransactionId: { type: String }, // Smart contract transaction ID
    verified: { type: Boolean, default: false }, // Verified on blockchain
    timestamp: { type: Date }, // Blockchain timestamp
  },
});

export default mongoose.model("Transaction", transactionSchema);
