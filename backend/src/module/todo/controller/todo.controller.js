import { HTTP_STATUS } from "../../../shared/constant.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { TodoService } from "../service/todo.service.js";
import { ApiResponse } from "./../../../utils/ApiResponse.js";

const todoService = new TodoService();

// single todo Controller
export const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.todos(req.body, req.user?._id);
  new ApiResponse(HTTP_STATUS.CREATED, todo, "Todo created successfully").send(
    res,
  );
});

// bulk todos Controller
export const createBulkTodos = asyncHandler(async (req, res) => {
  const todos = req.body?.todos;

  if (!Array.isArray(todos) || todos.length === 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Todos array is required and cannot be empty",
    );
  }

  const result = await todoService.bulkTodos(todos, req.user?._id);

  if (result.failedCount > 0) {
    if (result.successCount === 0) {
      return new ApiResponse(
        HTTP_STATUS.BAD_REQUEST,
        result,
        "No todos were created",
      ).send(res);
    }
    return new ApiResponse(
      HTTP_STATUS.ACCEPTED,
      result,
      `Partially created: ${result.successCount} succeeded, ${result.failedCount} failed`,
    ).send(res);
  }

  new ApiResponse(
    HTTP_STATUS.CREATED,
    result,
    "Bulk todos created successfully",
  ).send(res);
});

// get todos Controller
export const getAllTodos = asyncHandler(async (req, res) => {
  const todo = await todoService.getAll();
});
