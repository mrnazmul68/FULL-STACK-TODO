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

  // যদি কিছু সফল হয় এবং কিছু ফেইল করে
  if (result.failedCount > 0) {
    const message =
      result.successCount > 0
        ? `Partially created: ${result.successCount} succeeded, ${result.failedCount} failed`
        : "Failed to create all todos";

    return new ApiResponse(
      HTTP_STATUS.ACCEPTED, // বা 200/207 Multi-Status
      result,
      message,
    ).send(res);
  }

  // সব সফল হলে
  new ApiResponse(
    HTTP_STATUS.CREATED,
    result,
    "Bulk todos created successfully",
  ).send(res);
});

//bulk todos Controller
// export const createBulkTodos = asyncHandler(async (req, res) => {
//   const todos = req.body?.todos;

//   if (!Array.isArray(todos) || todos.length === 0) {
//     throw new ApiError(
//       HTTP_STATUS.BAD_REQUEST,
//       "Todos array is required and cannot be empty",
//     );
//   }

//   const allTodos = await todoService.bulkTodos(todos, req.user?._id);
//   new ApiResponse(
//     HTTP_STATUS.CREATED,
//     allTodos,
//     "Bulk todos created successfully",
//   ).send(res);
// });
