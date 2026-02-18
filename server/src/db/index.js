import mongoose from "mongoose";
import logger from "../utils/logger.js";
import config from "../config/index.js";

const connect = async () => {
  try {
    // Use process.env.MONGODB_URI directly if config.mongodb.uri is not available
    const mongoUri = config.mongodb.uri || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables or config");
    }
    
    await mongoose.connect(mongoUri);
    logger.info("MongoDb connected successfully");
  } catch (error) {
    logger.error("MongoDb connection error:", error);
    process.exit(1);
  }
};

export default connect;
