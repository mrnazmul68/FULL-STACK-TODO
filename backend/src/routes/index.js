import { Router } from "express";
import { authRoute } from "../module/auth/routes/auth.Routes.js";

export const router = Router()

router.use('/auth', authRoute)