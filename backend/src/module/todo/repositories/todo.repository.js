import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import { title_collation, Todo } from "../model/todo.model.js";

export class TodoRepository {
  constructor(model = Todo) {
    this.model = model;
  }
  async createTodo(todoData) {
    try {
      const todo = await this.model.create(todoData);
      return todo;
    } catch (err) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        err.message || "Todo creation failed",
      );
    }
  }

  // bulk todos Repository
  bulkCreateTodos;
  async createBulkTodos(todosData) {
    return await this.model.insertMany(todosData, {
      ordered: false,
    });
  }
}
