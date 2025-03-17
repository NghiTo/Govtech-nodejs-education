import express, { Application } from "express";
import dotenv from "dotenv";
import setupMiddleware from "./middlewares/setupMiddleware";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT;

setupMiddleware(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
