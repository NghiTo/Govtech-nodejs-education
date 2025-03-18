import { isCelebrateError } from "celebrate";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isCelebrateError(err)) {
    const details =
      err.details.get("body") || err.details.values().next().value;
    const message = details?.details[0].message || "Invalid request";

    res.status(400).json({ message });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    message: err.message,
  });
};
