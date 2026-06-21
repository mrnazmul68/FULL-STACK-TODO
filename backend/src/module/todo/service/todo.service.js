import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import { TodoRepository } from "../repositories/todo.repository.js";

export class TodoService {
  constructor(todoRepo = new TodoRepository()) {
    this.todoRepository = todoRepo;
  }
  async todos(todoData, userId) {
    try {
      const todo = await this.todoRepository.createTodo({
        ...todoData,
        user: userId,
      });
      return todo;
    } catch (error) {
      if (error.message === "Duplicate title") {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Todo with this title already exists",
        );
      }
      throw error;
    }
  }
  async bulkTodos(todosData, userId) {
    const todosWithUser = (todosData || []).map((todo) => ({
      ...todo,
      user: userId,
    }));
    try {
      const created = await this.todoRepository.createBulkTodos(todosWithUser);
      return {
        count: created.length,
        todos: created,
      };
    } catch (error) {
      console.error(error);
    }
  }
}

// import { createTodoRepository } from "../repositories/todo.repository.js";

// export const createTodoService = (todoRepository = createTodoRepository()) => {
//   return {
//     create: async (todoData) => {
//       try {
//         return await todoRepository.create(todoData);
//       } catch (err) {
//         console.error(err.message);
//       }
//     },
//   };
// };
