import { HTTP_STATUS } from "../../../shared/constant.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { TodoService } from "../service/todo.service.js";
import { ApiResponse } from "./../../../utils/ApiResponse.js";

const todoService = new TodoService();

export const createTodo = asyncHandler(async (req, res) => {
  const todo = await todoService.todos(req.body);
  new ApiResponse(HTTP_STATUS.CREATED, todo, "Todo created successfully").send(
    res,
  );
});
