import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { AppError } from "../utils/AppError";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`${err.statusCode} ${err.message}`, { stack: err.stack });
    } else if (err.statusCode >= 400) {
      logger.warn(`${err.statusCode} ${err.message}`);
    }

    res.status(err.statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } else {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });

    res.status(500).json({
      message: "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && {
        details: err.message,
      }),
    });
  }
};

export { errorHandler };
