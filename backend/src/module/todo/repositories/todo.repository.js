import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import { toPlainObjects } from "../../../utils/toPlainObjects.js";
import { title_collation, Todo } from "../model/todo.model.js";

const DEFALULT_SORT = { createdAt: -1 };

export class TodoRepository {
  constructor(model = Todo) {
    this.model = model;
  }

  //single todo Repository
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
  async createBulkTodos(todosData) {
    return await this.model.insertMany(todosData, {
      ordered: false,
    });
  }

  //find with pagination and filter
  async findWithPagination(query, { page, limit, sort = DEFALULT_SORT }) {
    if (page < 1 || limit < 1) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid pagination parameters: page=${page}, limit=${limit}",
      );
    }
    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      this.model.find(query).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);
    return { todos: todos.map(toPlainObjects), total };
  }
}
