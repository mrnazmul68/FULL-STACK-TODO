import { createTodo } from "../controllers/todo.controller.js";
import { Router } from "express";

export const todoRouter = Router();

todoRouter.get("/", createTodo);
