import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  deleteAllListings,
  filterListings,
  getPostedListingForUser,
  makePayment,
  getTransactionData,
  getReceipt,
} from "../controllers/listingController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createListingSchema,
  paymentSchema,
} from "../validators/listingValidator.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/post", authMiddleware, validate(createListingSchema), createListing);
router.get("/posted-data", authMiddleware, getPostedListingForUser);
router.post("/payment", authMiddleware, validate(paymentSchema), makePayment);
router.get("/payment-data", authMiddleware, getTransactionData);
router.get("/receipt/:transactionId", authMiddleware, getReceipt);

// Public routes
router.get("/", getListings);
router.get("/filter", filterListings);
router.get("/:id", getListingById);

// Admin routes (should add admin middleware later)
router.put("/:id", authMiddleware, updateListing);
router.delete("/:id", authMiddleware, deleteListing);
router.delete("/all/listings", authMiddleware, deleteAllListings);

export default router; // Exporting the router
