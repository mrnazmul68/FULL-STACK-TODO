import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import { TodoRepository } from "../repositories/todo.repository.js";

export class TodoService {
  constructor(todoRepo = new TodoRepository()) {
    this.todoRepository = todoRepo;
  }
  async todos(todoData) {
    try {
      const todo = await this.todoRepository.createTodo({ ...todoData });
      return todo;
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Service error for todo",
      );
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
