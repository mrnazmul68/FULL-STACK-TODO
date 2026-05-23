import express from "express";

export const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("Backend is working");
});
