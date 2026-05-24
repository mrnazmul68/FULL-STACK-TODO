import express from "express";
import { appRoutes } from "./routes/app.Routes.js";

export const app = express();

app.use("/", appRoutes);
