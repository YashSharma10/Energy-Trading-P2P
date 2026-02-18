import express from "express";
import { getChatbotContext } from "../controllers/chatbotController.js";

const router = express.Router();

router.get("/context", getChatbotContext);

export default router;
