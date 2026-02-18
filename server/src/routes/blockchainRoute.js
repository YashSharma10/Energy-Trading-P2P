import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import blockchainService from "../services/blockchainService.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * @route GET /api/blockchain/network-info
 * @desc Get blockchain network information
 * @access Public
 */
router.get("/network-info", async (req, res) => {
  try {
    const networkInfo = await blockchainService.getNetworkInfo();
    res.json({
      success: true,
      data: networkInfo,
    });
  } catch (error) {
    logger.error("Error getting network info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get network information",
    });
  }
});

/**
 * @route GET /api/blockchain/gas-price
 * @desc Get current gas price
 * @access Public
 */
router.get("/gas-price", async (req, res) => {
  try {
    const gasPrice = await blockchainService.getGasPrice();
    res.json({
      success: true,
      data: {
        gasPrice: `${gasPrice} Gwei`,
      },
    });
  } catch (error) {
    logger.error("Error getting gas price:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get gas price",
    });
  }
});

/**
 * @route POST /api/blockchain/validate-address
 * @desc Validate Ethereum address
 * @access Public
 */
router.post("/validate-address", (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const isValid = blockchainService.isValidAddress(address);
    res.json({
      success: true,
      data: {
        address,
        isValid,
      },
    });
  } catch (error) {
    logger.error("Error validating address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to validate address",
    });
  }
});

/**
 * @route GET /api/blockchain/balance/:address
 * @desc Get balance of an Ethereum address
 * @access Public
 */
router.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;

    if (!blockchainService.isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ethereum address",
      });
    }

    const balance = await blockchainService.getBalance(address);
    res.json({
      success: true,
      data: {
        address,
        balance: `${balance} ETH`,
      },
    });
  } catch (error) {
    logger.error("Error getting balance:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get balance",
    });
  }
});

/**
 * @route GET /api/blockchain/seller-whitelist/:address
 * @desc Check if seller is whitelisted
 * @access Public
 */
router.get("/seller-whitelist/:address", async (req, res) => {
  try {
    const { address } = req.params;

    if (!blockchainService.isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ethereum address",
      });
    }

    const isWhitelisted = await blockchainService.isSellerWhitelisted(address);
    res.json({
      success: true,
      data: {
        address,
        isWhitelisted,
      },
    });
  } catch (error) {
    logger.error("Error checking seller whitelist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check whitelist status",
    });
  }
});

/**
 * @route POST /api/blockchain/prepare-payment
 * @desc Prepare payment transaction data
 * @access Private
 */
router.post("/prepare-payment", authMiddleware, async (req, res) => {
  try {
    const { buyerAddress, sellerAddress, amount, quantity, listingId } = req.body;

    if (!blockchainService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Blockchain service is not configured",
      });
    }

    if (!blockchainService.isValidAddress(buyerAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid buyer address",
      });
    }

    if (!blockchainService.isValidAddress(sellerAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seller address",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const txConfig = await blockchainService.preparePaymentTransaction(
      buyerAddress,
      sellerAddress,
      amount,
      quantity,
      listingId
    );

    res.json({
      success: true,
      data: {
        transactionData: txConfig.data,
        gas: txConfig.gas,
        gasPrice: txConfig.gasPrice,
        from: txConfig.from,
        to: txConfig.to,
      },
    });
  } catch (error) {
    logger.error("Error preparing payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to prepare payment",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/blockchain/verify-transaction/:transactionId
 * @desc Verify a blockchain transaction
 * @access Private
 */
router.get("/verify-transaction/:transactionId", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!blockchainService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Blockchain service is not configured",
      });
    }

    const isValid = await blockchainService.verifyTransaction(transactionId);
    res.json({
      success: true,
      data: {
        transactionId,
        verified: isValid,
      },
    });
  } catch (error) {
    logger.error("Error verifying transaction:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify transaction",
    });
  }
});

/**
 * @route GET /api/blockchain/transaction/:transactionId
 * @desc Get transaction details from blockchain
 * @access Private
 */
router.get("/transaction/:transactionId", authMiddleware, async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!blockchainService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Blockchain service is not configured",
      });
    }

    const transaction = await blockchainService.getTransactionDetails(transactionId);
    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error("Error getting transaction details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get transaction details",
    });
  }
});

export default router;
