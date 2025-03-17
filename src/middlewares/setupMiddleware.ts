import express, { Application } from "express";
import { globalErrorHandler } from "./errorHandler";

const setupMiddleware = (app: Application) => {
  app.use(express.json());
  app.use(globalErrorHandler);
};

export default setupMiddleware;
