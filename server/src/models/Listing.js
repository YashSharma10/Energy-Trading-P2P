import mongoose from "mongoose";

const CarbonCreditSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true
  },
  quantity: { type: Number, min: 0, required: true },
  pricePerCredit: { type: Number, min: 0, required: true, index: true },
  totalPrice: { type: Number, min: 0 },
  location: { type: String, required: true, index: true },
  projectType: {
    type: String,
    enum: [
      "Reforestation",
      "Renewable Energy",
      "Waste Management",
      "Agriculture",
      "Blue Carbon",
      "Others",
    ],
    required: true,
    index: true
  },
  verification: {
    verifiedBy: {
      type: String,
      enum: ["VCS", "Gold Standard", "CDM", "Others"],
      required: true,
    },
    certificateUrl: { type: String, required: false },
  },
  status: {
    type: String,
    enum: ["Available", "Sold", "Pending"],
    default: "Available",
    index: true,
  },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

// Text index for search functionality
CarbonCreditSchema.index({ 
  title: "text", 
  description: "text", 
  location: "text" 
});

// Auto-calculate total price before saving
CarbonCreditSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.pricePerCredit;
  next();
});

const CarbonCredit = mongoose.model("CarbonCredit", CarbonCreditSchema);
export default CarbonCredit;
