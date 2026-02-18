import express from "express";
import cors from "cors";
import connect from "./src/db/index.js";
import logger from "./src/utils/logger.js";
import config from "./src/config/index.js";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// import routes
import userRoutes from "./src/routes/authRoute.js";
import carbonCreditRoutes from "./src/routes/listingRoute.js";
import adminRoutes from "./src/routes/adminRoute.js";
import analyticsRoutes from "./src/routes/analyticsRoute.js";
import chatbotRoutes from "./src/routes/chatbotRoute.js";

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/credits", carbonCreditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Start Server
const PORT = config.port;

try {
  await connect();
  app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
  });
} catch (err) {
  logger.error("❌ MongoDB connection error:", err);
  process.exit(1);
}
