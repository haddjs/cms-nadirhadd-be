import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/AppError";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies.token;

  if (!authHeader)
    throw new UnauthorizedError("You don't have access to this site.");

  try {
    jwt.verify(authHeader, process.env.JWT_SECRET as string);
    next();
  } catch (error) {
    throw new UnauthorizedError("Session expired.");
  }
};

export { authenticateToken };
