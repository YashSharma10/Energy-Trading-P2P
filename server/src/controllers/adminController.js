import User from "../models/userModel.js";
import CarbonCredit from "../models/Listing.js";
import Transaction from "../models/transactionsModel.js";
import logger from "../utils/logger.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", role = "" } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get platform statistics
export const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      totalTransactions,
      activeListings,
      verifiedUsers,
      totalRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      CarbonCredit.countDocuments(),
      Transaction.countDocuments(),
      CarbonCredit.countDocuments({ status: "Available" }),
      User.countDocuments({ isVerified: true }),
      Transaction.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const revenueData = totalRevenue[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalListings,
        totalTransactions,
        activeListings,
        verifiedUsers,
        totalRevenue: revenueData,
      },
    });
  } catch (error) {
    logger.error("Error fetching platform stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch platform statistics",
    });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`User ${userId} status updated to ${isActive ? "active" : "inactive"}`);

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  } catch (error) {
    logger.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["buyer", "seller", "both", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`User ${userId} role updated to ${role}`);

    res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    logger.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

// Get recent transactions (admin view)
export const getRecentTransactions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit, 10);

    const transactions = await Transaction.find()
      .populate("buyer", "email name")
      .populate("seller", "email name")
      .populate("listing", "title projectType")
      .sort({ purchaseDate: -1 })
      .limit(limitNum);

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    logger.error("Error fetching recent transactions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

// Delete listing (admin only)
export const adminDeleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await CarbonCredit.findByIdAndDelete(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    logger.info(`Admin deleted listing ${listingId}`);

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting listing:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete listing",
    });
  }
};
