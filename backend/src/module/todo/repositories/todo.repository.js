import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import { Todo } from "../model/todo.model.js";

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
        "Todo creation failed",
      );
    }
  }
}




// import { Todo } from "../model/todo.model.js";

// export const createTodoRepository = () => {
//   return {
//     create: async (todoData) => {
//       try {
//         const todo = await Todo.create(todoData);
//         return todo;
//       } catch (err) {
//         console.error(err);
//       }
//     },
//   };
// };
