import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";
import { getUserByEmail } from "../models/auth.model";
import { UnauthorizedError, ValidationError } from "../utils/AppError";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const data = await getUserByEmail(username);
    if (!username || !password)
      throw new ValidationError("Please fill all fields");
    if (!data)
      throw new UnauthorizedError("Username or Password didn't match!");

    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch)
      throw new UnauthorizedError("Username or password didn't match!");

    const token = jwt.sign(
      { id: data.id, username: data.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    logger.info(`User ${username} logged in`);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login success!" });
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  logger.info(`User ${req.body.username} logged out`);
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!" });
};

export { login, logout };
