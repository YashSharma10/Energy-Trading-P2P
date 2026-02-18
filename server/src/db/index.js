import mongoose from "mongoose";
import logger from "../utils/logger.js";
import config from "../config/index.js";

const connect = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    logger.info("MongoDb connected successfully");
  } catch (error) {
    logger.error("MongoDb connection error:", error);
    process.exit(1);
  }
};

export default connect;
