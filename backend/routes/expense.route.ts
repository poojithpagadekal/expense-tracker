import express from "express";
import {
  createExpense,
  deleteExpense,
  getExpense,
  updateExpense,
} from "../controllers/expense.controller";
import { authmiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router
  .route("/")
  .post(authmiddleware, createExpense)
  .get(authmiddleware, getExpense);
router
  .route("/:id")
  .put(authmiddleware, updateExpense)
  .delete(authmiddleware, deleteExpense);

export default router;
