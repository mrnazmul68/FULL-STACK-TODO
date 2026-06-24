import { Router } from "express";
import { validate } from "./../../../middleware/validation.Middleware.js";
import { createBulkTodos, createTodo } from "../controller/todo.controller.js";
import { protect } from "../../../middleware/routerAuthMiddleware.js";
import {
  bulkTodosValidationSchema,
  getTodosQuerySchema,
  todoValidationSchema,
} from "../validation/todo.validation.js";

export const todoRouter = Router();

todoRouter.use(protect);

todoRouter.post("/create", validate(todoValidationSchema), createTodo);
todoRouter.post("/bulk", validate(bulkTodosValidationSchema), createBulkTodos);
todoRouter.post("/get-todos", validate(getTodosQuerySchema), createBulkTodos);
