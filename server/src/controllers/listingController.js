import CarbonCredit from "../models/Listing.js";
import transactionsModel from "../models/transactionsModel.js";
import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";
import { sendNotificationEmail, emailTemplates } from "../utils/emailNotifications.js";
import { generateReceiptData } from "../utils/receiptGenerator.js";
import { validateListingAuthenticity } from "../services/listingModerationService.js";
import Stripe from "stripe";
import config from "../config/index.js";

const stripe = new Stripe(config.stripe.secretKey);

// ✅ Create a new listing
export const createListing = async (req, res) => {
  try {
    const userId = req.user.userId;

    const moderationResult = await validateListingAuthenticity(req.body);
    if (!moderationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Listing failed AI validation. Please fix the flagged issues.",
        errors: moderationResult.reasons || ["Listing appears invalid or potentially fraudulent."],
        errorFields: moderationResult.errorFields || [],
        validation: moderationResult,
      });
    }

    const listingData = {
      ...req.body,
      seller: userId,
      status: "Pending",
      moderation: {
        aiValidation: moderationResult,
        adminApproval: {
          state: "pending",
        },
      },
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
      message: "Listing submitted for admin approval",
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
      search = ""
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    
    // Add search if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Public listings should only show live/approved listings.
    query.status = "Available";

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
    if (!listing || listing.status !== "Available") {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
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
    filter.status = "Available";
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
    const existingListing = await CarbonCredit.findById(req.params.id);
    if (!existingListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Seller can only update their own listing; admin can update any.
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && existingListing.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own listings",
      });
    }

    // Prevent bypassing moderation workflow through direct updates.
    const updates = { ...req.body };
    delete updates.status;
    delete updates.moderation;
    delete updates.seller;

    const updatedListing = await CarbonCredit.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

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

// ✅ Create Stripe checkout session for carbon credit purchase
export const createCreditCheckoutSession = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { listingId, quantity } = req.body;

    const buyer = await userModel.findById(buyerId);
    if (!buyer) return res.status(404).json({ success: false, message: "User not found" });

    const listing = await CarbonCredit.findById(listingId);
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });
    if (listing.status !== "Available") return res.status(400).json({ success: false, message: "Listing is not available" });
    if (listing.quantity < quantity) return res.status(400).json({ success: false, message: `Only ${listing.quantity} credits available` });
    if (listing.seller.toString() === buyerId) return res.status(400).json({ success: false, message: "You cannot purchase your own credits" });

    const pricePerCredit = listing.pricePerCredit;
    const totalAmount = pricePerCredit * quantity;

    // Stripe minimum is ~₹50 (50 cents USD equivalent)
    if (totalAmount < 50) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹50. Current total is ₹${totalAmount}. Please increase the quantity.`,
      });
    }

    const transactionHash = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Create a pending transaction
    const transaction = new transactionsModel({
      listing: listingId,
      buyer: buyerId,
      seller: listing.seller,
      quantity,
      pricePerCredit,
      totalAmount,
      paymentStatus: "pending",
      paymentMethod: "card",
      transactionHash,
    });
    await transaction.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: `${quantity} carbon credit(s) — ${listing.projectType}`,
            },
            unit_amount: Math.round(pricePerCredit * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${config.clientUrl}/payment?success=true&transactionId=${transaction._id}`,
      cancel_url: `${config.clientUrl}/payment?id=${listingId}&price=${pricePerCredit}&title=${encodeURIComponent(listing.title)}&maxQuantity=${listing.quantity}&canceled=true`,
      metadata: {
        transactionId: transaction._id.toString(),
        listingId,
        buyerId,
        sellerId: listing.seller.toString(),
        quantity: quantity.toString(),
      },
    });

    transaction.stripeSessionId = session.id;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: { sessionUrl: session.url, transactionId: transaction._id },
    });
  } catch (error) {
    logger.error("Error creating credit checkout session:", error);
    res.status(500).json({ success: false, message: "Failed to create checkout session", error: error.message });
  }
};

// ✅ Stripe webhook for carbon credit payments
export const handleCreditStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err) {
    logger.error("Credit webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const { transactionId, listingId, buyerId, sellerId, quantity } = session.metadata;
      const qty = Number(quantity);

      const transaction = await transactionsModel.findById(transactionId);
      if (!transaction || transaction.paymentStatus === "completed") {
        return res.json({ received: true });
      }

      // Mark transaction complete
      transaction.paymentStatus = "completed";
      transaction.stripePaymentIntentId = session.payment_intent;
      transaction.completedAt = Date.now();
      await transaction.save();

      // Deduct listing quantity
      const newQuantity = (await CarbonCredit.findById(listingId))?.quantity - qty;
      await CarbonCredit.findByIdAndUpdate(listingId, {
        $inc: { quantity: -qty },
        status: newQuantity <= 0 ? "Sold" : "Available",
        updatedAt: Date.now(),
      });

      // Update buyer stats
      await userModel.findByIdAndUpdate(buyerId, {
        $push: { transactions: transaction._id },
        $inc: { totalSpents: transaction.totalAmount },
      });

      // Update seller stats
      await userModel.findByIdAndUpdate(sellerId, { $inc: { totalCredits: qty } });

      logger.info(`Credit payment completed: ${transactionId}`);
    } catch (err) {
      logger.error("Error handling credit checkout completion:", err);
    }
  }

  res.json({ received: true });
};

// ✅ Get a single transaction by ID (for post-payment success polling)
// Also completes the transaction if Stripe confirms payment but webhook hasn't fired yet
export const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.userId;

    const transaction = await transactionsModel
      .findById(transactionId)
      .populate("listing", "title projectType")
      .populate("seller", "email");

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.buyer.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // If still pending, check Stripe directly and complete if paid
    if (transaction.paymentStatus === "pending" && transaction.stripeSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(transaction.stripeSessionId);
        if (session.payment_status === "paid") {
          // Atomic update — only proceeds if still pending (prevents double-processing)
          const updated = await transactionsModel.findOneAndUpdate(
            { _id: transactionId, paymentStatus: "pending" },
            {
              paymentStatus: "completed",
              stripePaymentIntentId: session.payment_intent,
              completedAt: new Date(),
            },
            { new: true }
          );

          if (updated) {
            // Deduct listing quantity
            const listingId = transaction.listing._id || transaction.listing;
            const listing = await CarbonCredit.findById(listingId);
            if (listing) {
              const newQty = listing.quantity - transaction.quantity;
              await CarbonCredit.findByIdAndUpdate(listingId, {
                $inc: { quantity: -transaction.quantity },
                status: newQty <= 0 ? "Sold" : "Available",
                updatedAt: new Date(),
              });
            }

            // Update buyer stats
            await userModel.findByIdAndUpdate(transaction.buyer, {
              $push: { transactions: transaction._id },
              $inc: { totalSpents: transaction.totalAmount },
            });

            // Update seller stats
            await userModel.findByIdAndUpdate(transaction.seller, {
              $inc: { totalCredits: transaction.quantity },
            });

            logger.info(`Transaction completed via poll: ${transactionId}`);
          }
        }
      } catch (stripeErr) {
        logger.warn("Could not verify Stripe session during poll:", stripeErr.message);
      }
    }

    // Re-fetch with populated fields after potential update
    const updated = await transactionsModel
      .findById(transactionId)
      .populate("listing", "title projectType");

    res.json({ success: true, data: updated });
  } catch (error) {
    logger.error("Error fetching transaction:", error);
    res.status(500).json({ success: false, message: "Failed to fetch transaction" });
  }
};
