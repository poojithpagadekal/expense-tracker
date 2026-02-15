import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

export const RegisterHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const duplicateUser = await User.findOne({ email });

    if (duplicateUser) {
      return res.status(409).json({
        error: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(201).json({
      status: "ok",
      message: "user created successfuly",
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "error creating user",
    });
    if (error instanceof Error) {
      console.log(`Error while registering user ${error.message}`);
    } else console.log("error creating user : ", error);
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "invalid credentials",
      });
    }

    const checkPassword = await user.isPasswordCorrect(password);
    if (checkPassword) {
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        status: "ok",
        message: "User logged in",
        accessToken: accessToken,
      });
    } else {
      return res.status(401).json({ error: "invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "error creating user",
    });
    if (error instanceof Error) {
      console.log(`Error while logging in user ${error.message}`);
    } else console.log("error logging in user : ", error);
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    user.refreshToken = undefined;

    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      status: "ok",
      message: "User loggedout",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "error while logging out user",
    });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { _id: string };

    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken != refreshToken) {
      return res.status(401).json({
        error: "Invalid refresh token",
      });
    }

    const newAccessToken = user.generateAccessToken();

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
