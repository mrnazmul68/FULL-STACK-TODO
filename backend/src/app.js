import express from "express";
import cors from 'cors';
import { appRoutes } from "./routes/app.Routes.js";

export const app = express();


app.use(cors());
app.use(express.json());

app.use("/api", appRoutes);

