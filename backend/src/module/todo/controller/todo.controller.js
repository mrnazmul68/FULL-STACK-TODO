import { HTTP_STATUS } from "../../../shared/constant.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { TodoService } from "../service/todo.service.js";
import { ApiResponse } from "./../../../utils/ApiResponse.js";

const todoService = new TodoService();

export const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.todos(req.body, req.user?._id);
  new ApiResponse(HTTP_STATUS.CREATED, todo, "Todo created successfully").send(
    res,
  );
});

//bulkCreateTodos
export const createBulkTodos = asyncHandler(async (req, res) => {
  const todos = req.body?.todos || [];
  const allTodos = await todoService.bulkTodos(todos, req.user?._id);
  new ApiResponse(
    HTTP_STATUS.CREATED,
    allTodos,
    "Bulk todos created successfully",
  ).send(res);
});
