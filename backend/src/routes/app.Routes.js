import { Router } from "express";
export const appRoutes = Router();

appRoutes.get("/", (req, res) => {
  res.send("Todo manager app backend is running");
});
