import express from "express";
import { todoRouter } from "./routes/todo.Routes.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("this is home page of backend");
});

app.use("/api/todos", todoRouter);
