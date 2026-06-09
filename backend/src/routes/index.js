import { Router } from "express";
import { authRoute } from "../module/auth/routes/auth.Routes.js";
import { todoRouter } from "../module/todo/routes/todo.route.js";

export const router = Router()

router.use('/auth', authRoute)
router.use("/todos", todoRouter)