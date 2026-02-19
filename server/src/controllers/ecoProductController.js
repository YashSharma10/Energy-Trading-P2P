import EcoProduct from "../models/EcoProduct.js";
import EcoOrder from "../models/EcoOrder.js";
import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";
import Stripe from "stripe";
import config from "../config/index.js";

const stripe = new Stripe(config.stripe.secretKey);

// ==============================
// ADMIN: Create a new eco product
// ==============================
export const createEcoProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      addedBy: req.user.userId,
    };

    const product = new EcoProduct(productData);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: "Eco product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    logger.error("Error creating eco product:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create eco product",
      error: error.message,
    });
  }
};

// ==============================
// ADMIN: Update an eco product
// ==============================
export const updateEcoProduct = async (req, res) => {
  try {
    const updated = await EcoProduct.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error("Error updating eco product:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ==============================
// ADMIN: Delete an eco product
// ==============================
export const deleteEcoProduct = async (req, res) => {
  try {
    const deleted = await EcoProduct.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting eco product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// ==============================
// PUBLIC: Get all eco products (with pagination & search)
// ==============================
export const getEcoProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category,
      minPrice,
      maxPrice,
      ecoRating,
      status = "Active",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (ecoRating) {
      query.ecoRating = { $gte: Number(ecoRating) };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const total = await EcoProduct.countDocuments(query);

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const products = await EcoProduct.find(query)
      .populate("addedBy", "email name")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: products,
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
    logger.error("Error fetching eco products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch eco products",
      error: error.message,
    });
  }
};

// ==============================
// PUBLIC: Get a single eco product by ID
// ==============================
export const getEcoProductById = async (req, res) => {
  try {
    const product = await EcoProduct.findById(req.params.id).populate(
      "addedBy",
      "email name",
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    logger.error("Error fetching eco product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ==============================
// AUTHENTICATED: Purchase an eco product
// ==============================
export const purchaseEcoProduct = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { productId, quantity, shippingAddress } = req.body;

    const buyer = await userModel.findById(buyerId);
    if (!buyer) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await EcoProduct.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available for purchase",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} items remaining.`,
      });
    }

    const totalAmount = product.price * quantity;

    // Reduce stock
    const newStock = product.stock - quantity;
    await EcoProduct.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity, totalSold: quantity },
      status: newStock === 0 ? "OutOfStock" : "Active",
      updatedAt: Date.now(),
    });

    // Create order
    const order = new EcoOrder({
      product: productId,
      buyer: buyerId,
      quantity,
      pricePerUnit: product.price,
      totalAmount,
      shippingAddress: shippingAddress || "",
      paymentStatus: "completed",
      orderStatus: "placed",
      orderHash: `ECO-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      completedAt: Date.now(),
    });

    await order.save();

    const populatedOrder = await EcoOrder.findById(order._id)
      .populate("product", "name category price imageUrl")
      .populate("buyer", "email name");

    logger.info(`Eco product purchased: ${order._id}`, {
      buyer: buyerId,
      product: productId,
      amount: totalAmount,
    });

    res.status(200).json({
      success: true,
      message: "Purchase completed successfully",
      data: {
        orderId: order._id,
        orderHash: order.orderHash,
        productName: product.name,
        quantity,
        totalAmount,
        stockRemaining: newStock,
      },
    });
  } catch (error) {
    logger.error("Eco product purchase failed:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Purchase failed",
    });
  }
};

// ==============================
// AUTHENTICATED: Get user's eco orders
// ==============================
export const getMyEcoOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await EcoOrder.find({ buyer: userId })
      .populate("product", "name category price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    logger.error("Error fetching eco orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ==============================
// ADMIN: Get all eco orders
// ==============================
export const getAllEcoOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await EcoOrder.countDocuments();

    const orders = await EcoOrder.find()
      .populate("product", "name category price imageUrl")
      .populate("buyer", "email name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    logger.error("Error fetching all eco orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ==============================
// ADMIN: Get eco marketplace stats
// ==============================
export const getEcoStats = async (req, res) => {
  try {
    const totalProducts = await EcoProduct.countDocuments();
    const activeProducts = await EcoProduct.countDocuments({
      status: "Active",
    });
    const totalOrders = await EcoOrder.countDocuments();

    const revenueResult = await EcoOrder.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const topProducts = await EcoProduct.find()
      .sort({ totalSold: -1 })
      .limit(5)
      .select("name category price totalSold imageUrl");

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue,
        topProducts,
      },
    });
  } catch (error) {
    logger.error("Error fetching eco stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};

// ==============================
// AUTHENTICATED: Create Stripe checkout session
// ==============================
export const createCheckoutSession = async (req, res) => {
  try {
    const buyerId = req.user.userId;
    const { productId, quantity, shippingAddress } = req.body;

    const buyer = await userModel.findById(buyerId);
    if (!buyer) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await EcoProduct.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available for purchase",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} items remaining.`,
      });
    }

    const totalAmount = product.price * quantity;
    const orderHash = `ECO-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Create a pending order
    const order = new EcoOrder({
      product: productId,
      buyer: buyerId,
      quantity,
      pricePerUnit: product.price,
      totalAmount,
      shippingAddress: shippingAddress || "",
      paymentStatus: "pending",
      orderStatus: "placed",
      orderHash,
    });

    await order.save();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              description: product.description,
              images: product.imageUrl ? [product.imageUrl] : [],
            },
            unit_amount: Math.round(product.price * 100), // Convert to paise/cents
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${config.clientUrl}/eco-marketplace?success=true&orderId=${order._id}`,
      cancel_url: `${config.clientUrl}/eco-marketplace?canceled=true`,
      metadata: {
        orderId: order._id.toString(),
        productId: productId,
        buyerId: buyerId,
        quantity: quantity.toString(),
      },
    });

    // Update order with Stripe session ID
    order.stripeSessionId = session.id;
    await order.save();

    logger.info(`Stripe checkout session created: ${session.id}`, {
      orderId: order._id,
      buyer: buyerId,
      product: productId,
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      data: {
        sessionId: session.id,
        sessionUrl: session.url,
        orderId: order._id,
        orderHash: order.orderHash,
      },
    });
  } catch (error) {
    logger.error("Error creating checkout session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

// ==============================
// WEBHOOK: Handle Stripe webhook events
// ==============================
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret,
    );
  } catch (err) {
    logger.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      logger.info("PaymentIntent succeeded:", paymentIntent.id);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      await handlePaymentFailed(failedPayment);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// Helper function to handle successful checkout
async function handleCheckoutSessionCompleted(session) {
  try {
    const orderId = session.metadata.orderId;
    const order = await EcoOrder.findById(orderId);

    if (!order) {
      logger.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order status
    order.paymentStatus = "completed";
    order.stripePaymentIntentId = session.payment_intent;
    order.completedAt = Date.now();
    await order.save();

    // Update product stock
    const product = await EcoProduct.findById(order.product);
    if (product) {
      const newStock = product.stock - order.quantity;
      await EcoProduct.findByIdAndUpdate(order.product, {
        $inc: { stock: -order.quantity, totalSold: order.quantity },
        status: newStock === 0 ? "OutOfStock" : "Active",
        updatedAt: Date.now(),
      });
    }

    logger.info(`Order completed successfully: ${orderId}`, {
      paymentIntent: session.payment_intent,
      amount: session.amount_total,
    });
  } catch (error) {
    logger.error("Error handling checkout session completion:", error);
  }
}

// Helper function to handle failed payment
async function handlePaymentFailed(paymentIntent) {
  try {
    // Find order by payment intent ID
    const order = await EcoOrder.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (order) {
      order.paymentStatus = "failed";
      await order.save();
      logger.info(`Order payment failed: ${order._id}`);
    }
  } catch (error) {
    logger.error("Error handling payment failure:", error);
  }
}
