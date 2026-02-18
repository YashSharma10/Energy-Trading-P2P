import CarbonCredit from "../models/Listing.js";
import transactionsModel from "../models/transactionsModel.js";
import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";
import { sendNotificationEmail, emailTemplates } from "../utils/emailNotifications.js";
import { generateReceiptData } from "../utils/receiptGenerator.js";

// ✅ Create a new listing
export const createListing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingData = {
      ...req.body,
      seller: userId,
    };
    
    const newListing = new CarbonCredit(listingData);
    const savedListing = await newListing.save();
    
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { posted: savedListing._id } },
      { new: true, runValidators: true }
    );
    
    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: savedListing,
    });
  } catch (error) {
    logger.error("Error creating listing:", error);
    res.status(400).json({ 
      success: false,
      message: "Failed to create listing",
      error: error.message 
    });
  }
};

// ✅ Get all listings with pagination and search
export const getListings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = "",
      status = "Available"
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    
    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Get total count for pagination
    const total = await CarbonCredit.countDocuments(query);
    
    // Fetch listings with pagination
    const listings = await CarbonCredit.find(query)
      .populate("seller", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    logger.error("Error fetching listings:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch listings",
      error: error.message 
    });
  }
};

// ✅ Get a specific listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await CarbonCredit.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const filterListings = async (req, res) => {
  try {
    const {
      projectType,
      status,
      location,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      verifiedBy,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};

    if (projectType) filter.projectType = projectType;
    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (verifiedBy) filter["verification.verifiedBy"] = verifiedBy;
    
    if (minPrice || maxPrice) {
      filter.pricePerCredit = {};
      if (minPrice) filter.pricePerCredit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerCredit.$lte = Number(maxPrice);
    }
    
    if (minQuantity || maxQuantity) {
      filter.quantity = {};
      if (minQuantity) filter.quantity.$gte = Number(minQuantity);
      if (maxQuantity) filter.quantity.$lte = Number(maxQuantity);
    }

    // Get total count
    const total = await CarbonCredit.countDocuments(filter);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const listings = await CarbonCredit.find(filter)
      .populate("seller", "email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      filters: filter,
    });
  } catch (error) {
    logger.error("Error filtering listings:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to filter listings",
      error: error.message 
    });
  }
};

// ✅ Update a listing
export const updateListing = async (req, res) => {
  try {
    const updatedListing = await CarbonCredit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedListing)
      return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a listing
export const deleteListing = async (req, res) => {
  try {
    const deletedListing = await CarbonCredit.findByIdAndDelete(req.params.id);
    if (!deletedListing)
      return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllListings = async (req, res) => {
  try {
    await CarbonCredit.deleteMany({});
    res.status(200).json({ 
      success: true,
      message: "All listings deleted successfully" 
    });
  } catch (error) {
    logger.error("Error deleting all listings:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete listings",
      error: error.message 
    });
  }
};

export const getPostedListingForUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userData = await userModel
      .findById(userId)
      .populate("posted")
      .select("posted");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      posted: userData.posted || [],
    });
  } catch (error) {
    logger.error("Error fetching posted listings:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posted listings",
    });
  }
};

export const getTransactionData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId).select("role");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get both buyer and seller transactions for regular users
    // Admin only sees admin-specific data
    let buyerTransactions = [];
    let sellerTransactions = [];
    
    if (user.role !== "admin") {
      // Get seller transactions
      sellerTransactions = await transactionsModel
        .find({ seller: userId })
        .populate("listing", "title description projectType")
        .populate("buyer", "email name")
        .sort({ createdAt: -1 });
      
      // Get buyer transactions
      const userData = await userModel
        .findById(userId)
        .populate({
          path: "transactions",
          populate: [
            { path: "listing", select: "title description projectType" },
            { path: "seller", select: "email name" },
          ],
        })
        .select("transactions");
      
      buyerTransactions = userData?.transactions || [];
    }

    return res.status(200).json({
      success: true,
      data: {
        transactions: buyerTransactions,
        sellerTransactions: sellerTransactions,
      },
    });
  } catch (error) {
    logger.error("Error fetching transaction data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction data",
    });
  }
};

export const makePayment = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { listingId, quantity, paymentMethod } = req.body;

    // 1. Validate buyer exists
    const buyer = await userModel.findById(buyerId);
    if (!buyer) {
      throw new Error("Buyer not found");
    }

    // 2. Find and validate listing
    const listing = await CarbonCredit.findById(listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.status !== "Available") {
      throw new Error("Listing is not available for purchase");
    }

    if (listing.quantity < quantity) {
      throw new Error(`Insufficient credits available. Only ${listing.quantity} credits remaining.`);
    }

    // 3. Prevent buying own credits
    if (listing.seller.toString() === buyerId) {
      throw new Error("You cannot purchase your own credits");
    }

    // 4. Calculate amounts
    const pricePerCredit = listing.pricePerCredit;
    const totalAmount = pricePerCredit * quantity;

    // 5. Update listing quantity atomically
    const newQuantity = listing.quantity - quantity;
    const newStatus = newQuantity === 0 ? "Sold" : "Available";

    await CarbonCredit.findByIdAndUpdate(
      listingId,
      {
        $inc: { quantity: -quantity },
        status: newStatus,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    // 6. Create transaction record
    const transaction = new transactionsModel({
      listing: listingId,
      buyer: buyerId,
      seller: listing.seller,
      quantity,
      pricePerCredit,
      totalAmount,
      paymentStatus: "completed",
      paymentMethod: paymentMethod || "other",
      transactionHash: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      completedAt: Date.now(),
    });

    await transaction.save();

    // 7. Update buyer's transaction history and spending
    await userModel.findByIdAndUpdate(
      buyerId,
      {
        $push: { transactions: transaction._id },
        $inc: { totalSpents: totalAmount },
      }
    );

    // 8. Update seller's credits sold
    await userModel.findByIdAndUpdate(
      listing.seller,
      {
        $inc: { totalCredits: quantity },
      }
    );

    // Send email notifications (non-blocking)
    const populatedTransaction = await transactionsModel
      .findById(transaction._id)
      .populate("listing", "title")
      .populate("buyer", "email")
      .populate("seller", "email");

    // Send purchase confirmation to buyer
    sendNotificationEmail(
      buyer.email,
      emailTemplates.purchaseConfirmation,
      populatedTransaction
    ).catch(err => logger.error("Failed to send purchase email:", err));

    // Send sale notification to seller
    const seller = await userModel.findById(listing.seller);
    if (seller) {
      sendNotificationEmail(
        seller.email,
        emailTemplates.listingSold,
        populatedTransaction
      ).catch(err => logger.error("Failed to send seller email:", err));
    }

    logger.info(`Payment successful: ${transaction._id}`, {
      buyer: buyerId,
      seller: listing.seller,
      amount: totalAmount,
    });

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      data: {
        transactionId: transaction._id,
        transactionHash: transaction.transactionHash,
        quantity,
        totalAmount,
        creditsRemaining: newQuantity,
      },
    });
  } catch (error) {
    logger.error("Payment failed:", error);
    
    return res.status(400).json({
      success: false,
      message: error.message || "Payment failed",
    });
  }
};

// ✅ Get transaction receipt
export const getReceipt = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    const transaction = await transactionsModel
      .findById(transactionId)
      .populate("buyer", "email name")
      .populate("seller", "email name")
      .populate("listing", "title description projectType location");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Verify user has access to this receipt
    if (
      transaction.buyer._id.toString() !== userId &&
      transaction.seller._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const receipt = generateReceiptData(transaction);

    res.json(receipt);
  } catch (error) {
    logger.error("Error generating receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate receipt",
    });
  }
};
