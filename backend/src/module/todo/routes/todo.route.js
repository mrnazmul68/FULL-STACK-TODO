import { Router } from "express";
import { validate } from "./../../../middleware/validation.Middleware.js";
import { todoValidationSchema } from "../validation/todo.validation.js";
import { createTodo } from "../controller/todo.controller.js";
import { protect } from "../../../middleware/routerAuthMiddleware.js";

export const todoRouter = Router();

todoRouter.use(protect)

todoRouter.post("/create", validate(todoValidationSchema), createTodo);
