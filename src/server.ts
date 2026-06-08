import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import mainRouter from "./routes/index";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", mainRouter);

app.use(errorHandler);

export default app;
