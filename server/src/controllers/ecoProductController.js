import EcoProduct from "../models/EcoProduct.js";
import EcoOrder from "../models/EcoOrder.js";
import userModel from "../models/userModel.js";
import logger from "../utils/logger.js";

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
      return res
        .status(400)
        .json({
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
