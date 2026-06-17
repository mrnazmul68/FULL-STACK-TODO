import express from "express";
import cors from 'cors';
import { appRoutes } from "./routes/app.Routes.js";
import { router } from "./routes/index.js";
import { errorMiddleware } from './middleware/errorMiddleware.js';

export const app = express();


app.use(cors());
app.use(express.json());

app.use("/", appRoutes);
app.use('/api/v1', router)


app.use(errorMiddleware)

