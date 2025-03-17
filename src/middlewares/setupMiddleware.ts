import express, { Application } from "express";

const setupMiddleware = (app: Application) => {
  app.use(express.json());
};

export default setupMiddleware;
