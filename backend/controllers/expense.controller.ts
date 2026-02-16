import { Request, Response } from "express";
import Expense from "../models/expense";

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { title, category, amount, date } = req.body;
    if (!title || !category || !amount) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    const expense = await Expense.create({
      title,
      category,
      amount,
      date,
      user: req.user!._id,
    });

    return res.status(201).json({
      status: "ok",
      message: "expense created",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "error while creating expense",
    });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ user: req.user!._id });
    return res.status(200).json({
      status: "ok",
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "error while fetching expenses",
    });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    const updates = req.body;

    if (!expense) {
      return res.status(404).json({
        status: "fail",
        message: "invalid id",
      });
    }

    if (expense.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Not authorized",
      });
    }

    Object.assign(expense, updates);
    await expense.save();

    return res.status(200).json({
      status: "ok",
      expense,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error updating expense",
    });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        status: "fail",
        message: "expense not found",
      });
    }

    if (expense.user.toString() !== req.user!._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Not authorized",
      });
    }

    await expense.deleteOne();

    return res.status(200).json({
      status: "ok",
      message: "expense deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "fail",
      message: "failed to delete expense",
    });
  }
};
