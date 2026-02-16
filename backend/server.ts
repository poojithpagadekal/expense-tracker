import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import coookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import expenseRouter from "./routes/expense.route";

const app: Application = express();

app.use(express.json());
app.use(cors());
dotenv.config();
app.use(coookieParser());
app.use("/api/auth", authRouter);
app.use("/api/expense", expenseRouter);

const PORT = process.env.PORT;

connectDB();

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
