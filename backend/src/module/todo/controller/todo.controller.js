import { HTTP_STATUS } from "../../../shared/constant.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { createTodoService } from "../service/todo.service.js";
import { ApiResponse } from "./../../../utils/ApiResponse.js";

const todoService = createTodoService();

export const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.create(req.body);
  new ApiResponse(HTTP_STATUS.CREATED, todo, "Todo created successfully").send(
    res,
  );
});
