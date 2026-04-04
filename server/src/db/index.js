import mongoose from "mongoose";
import logger from "../utils/logger.js";
import config from "../config/index.js";

const maskMongoUri = (uri = "") =>
  uri.replace(/\/\/([^:@]+):([^@]+)@/, "//$1:****@");

const connect = async () => {
  const primaryUri = config.mongodb.uri || process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_URI_DIRECT;

  if (!primaryUri && !fallbackUri) {
    logger.error(
      "MongoDb connection error: MONGODB_URI (or MONGODB_URI_DIRECT) is not defined",
    );
    process.exit(1);
  }

  const candidates = [primaryUri, fallbackUri].filter(Boolean);
  const errors = [];

  for (const uri of candidates) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
      });
      logger.info(`MongoDb connected successfully using ${maskMongoUri(uri)}`);
      return;
    } catch (error) {
      errors.push({ uri: maskMongoUri(uri), message: error.message });
      logger.warn(
        `MongoDb connection failed for ${maskMongoUri(uri)}: ${error.message}`,
      );
    }
  }

  logger.error("MongoDb connection error: all configured URIs failed", {
    attempts: errors,
    hint: "If mongodb+srv DNS fails (ECONNREFUSED/querySrv), set MONGODB_URI_DIRECT in server/.env using Atlas standard (non-SRV) URI.",
  });
  process.exit(1);
};

export default connect;
