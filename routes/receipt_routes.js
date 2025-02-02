import express from "express";
import { getReceiptPointsById, processReceiptById } from "../controllers/receipt_controller.js";

const router = express.Router();

router.post("/process", processReceiptById);
router.get("/:id/points", getReceiptPointsById);

export default router;