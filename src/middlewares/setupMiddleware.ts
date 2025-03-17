import express, { Application } from "express";
import { globalErrorHandler } from "./errorHandler";
import { AppError } from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import router from "../routes/mainRoute";

const setupMiddleware = (app: Application) => {
  app.use(express.json());
  app.use("/api", router);
  app.all("*", (req, res, next) => {
    next(
      new AppError({
        message: `Can't find ${req.originalUrl} on this server`,
        statusCode: StatusCodes.NOT_FOUND,
      })
    );
  });
  app.use(globalErrorHandler);
};

export default setupMiddleware;
