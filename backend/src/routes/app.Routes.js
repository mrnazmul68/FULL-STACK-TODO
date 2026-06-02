import { Router } from "express";

 export const appRoutes = Router();

appRoutes.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API running successfully",
  });
});


