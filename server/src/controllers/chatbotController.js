import CarbonCredit from "../models/Listing.js";
import transactionsModel from "../models/transactionsModel.js";
import userModel from "../models/userModel.js";
// import { logger } from "../utils/logger.js";

export const getChatbotContext = async (req, res) => {
  try {
    // Get platform statistics
    const totalListings = await CarbonCredit.countDocuments();
    const availableListings = await CarbonCredit.countDocuments({ status: "Available" });
    const totalTransactions = await transactionsModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    
    // Get sample listings
    const sampleListings = await CarbonCredit.find({ status: "Available" })
      .select("title projectType quantity pricePerCredit location certificationStandard")
      .limit(10)
      .lean();

    // Get project types distribution
    const projectTypes = await CarbonCredit.aggregate([
      { $group: { _id: "$projectType", count: { $sum: 1 } } }
    ]);

    // Get total credits available
    const totalCreditsAvailable = await CarbonCredit.aggregate([
      { $match: { status: "Available" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    // Get price range
    const priceStats = await CarbonCredit.aggregate([
      { $match: { status: "Available" } },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$pricePerCredit" },
          maxPrice: { $max: "$pricePerCredit" },
          avgPrice: { $avg: "$pricePerCredit" }
        }
      }
    ]);

    // Get certification standards
    const certifications = await CarbonCredit.aggregate([
      { $group: { _id: "$certificationStandard", count: { $sum: 1 } } }
    ]);

    const context = {
      platformInfo: {
        name: "CarbonEase",
        description: "A blockchain-verified carbon credit trading platform connecting buyers and sellers transparently",
        features: [
          "Blockchain-verified transactions",
          "Real-time carbon footprint calculator",
          "Registry-certified credits (Verra, Gold Standard, ACR)",
          "Live analytics and impact tracking",
          "Multiple payment methods (Card, UPI, Crypto)",
          "Global project mapping",
          "Automated receipt generation"
        ]
      },
      statistics: {
        totalListings,
        availableListings,
        totalTransactions,
        totalUsers,
        totalCreditsAvailable: totalCreditsAvailable[0]?.total || 0,
        priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
      },
      projectTypes: projectTypes.map(pt => ({ type: pt._id, count: pt.count })),
      certifications: certifications.map(c => ({ standard: c._id, count: c.count })),
      sampleListings: sampleListings.map(listing => ({
        title: listing.title,
        type: listing.projectType,
        quantity: listing.quantity,
        price: listing.pricePerCredit,
        location: listing.location,
        certification: listing.certificationStandard
      }))
    };

    return res.status(200).json({
      success: true,
      context
    });
  } catch (error) {
    logger.error("Error fetching chatbot context:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chatbot context"
    });
  }
};
