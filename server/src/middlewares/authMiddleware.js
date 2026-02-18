import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    logger.warn("Access attempt without valid token!");
    return res.status(401).json({
      message: "Authentication required",
      success: false,
    });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      logger.warn("Invalid token!");
      return res.status(403).json({
        message: "Invalid or expired token",
        success: false,
      });
    }

    req.user = user;
    next();
  });
};

export default authMiddleware;
export { authMiddleware };