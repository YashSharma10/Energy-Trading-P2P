// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    PROFILE: "/auth/profile",
  },
  
  // Listings/Credits
  CREDITS: {
    BASE: "/credits",
    POSTED: "/credits/posted-data",
    PAYMENT: "/credits/payment",
    TRANSACTIONS: "/credits/payment-data",
    RECEIPT: (id) => `/credits/receipt/${id}`,
    BY_ID: (id) => `/credits/${id}`,
    DELETE_ALL: "/credits/all/listings",
  },
  
  // Admin
  ADMIN: {
    USERS: "/admin/users",
    STATS: "/admin/stats",
    TRANSACTIONS: "/admin/transactions",
    USER_STATUS: (id) => `/admin/users/${id}/status`,
    USER_ROLE: (id) => `/admin/users/${id}/role`,
    DELETE_LISTING: (id) => `/admin/listings/${id}`,
  },
  
  // Analytics
  ANALYTICS: {
    SELLER: "/analytics/seller",
    BUYER: "/analytics/buyer",
    MARKET_TRENDS: "/analytics/market-trends",
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: {
    MARKETPLACE: 6,
    ADMIN_USERS: 20,
    TRANSACTIONS: 10,
  },
};

// Role Constants
export const ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  BOTH: "both",
  ADMIN: "admin",
};

// Project Types
export const PROJECT_TYPES = [
  "Renewable Energy",
  "Reforestation",
  "Energy Efficiency",
  "Carbon Capture",
  "Waste Management",
  "Ocean Conservation",
];

// Listing Status
export const LISTING_STATUS = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  PENDING: "Pending",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};
