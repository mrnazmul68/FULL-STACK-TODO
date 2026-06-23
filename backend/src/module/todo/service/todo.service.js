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
      if (error.code === 11000) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Todo with this title already exists",
        );
      }
      throw error;
    }
  }

  // bulktodos Service
  async bulkTodos(todosData, userId) {
    if (!userId) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }
    const todosWithUser = todosData.map((todo) => ({
      ...todo,
      user: userId,
    }));

    try {
      const created = await this.todoRepository.createBulkTodos(todosWithUser);
      return {
        successCount: created.length,
        failedCount: 0,
        inserted: created,
        errors: [],
      };
    } catch (error) {
      // যদি এটি MongoBulkWriteError বা writeErrors যুক্ত কোনো এরর হয়
      if (
        error.name === "BulkWriteError" ||
        error.name === "MongoBulkWriteError" ||
        error.writeErrors
      ) {
        const inserted = error.insertedDocs || [];
        const errors = (error.writeErrors || []).map((err) => {
          let reason = "Creation failed";

          // duplicate key error code is 11000
          if (err.code === 11000) {
            reason = `Todo with title '${err.op?.title}' already exists`;
          } else if (err.errmsg) {
            reason = err.errmsg;
          }

          return {
            index: err.index,
            todo: err.op,
            reason: reason,
          };
        });

        return {
          successCount: inserted.length,
          failedCount: errors.length,
          inserted: inserted,
          errors: errors,
        };
      }

      // সাধারণ অন্য কোনো এরর হলে সেটা আগের মতোই থ্রো করবে
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error.message || "Bulk todo creation failed",
      );
    }
  }
}

//bulktodos Service
// async bulkTodos(todosData, userId) {
//   if (!userId) {
//     throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
//   }
//   const todosWithUser = todosData.map((todo) => ({
//     ...todo,
//     user: userId,
//   }));

//   try {
//     const created = await this.todoRepository.createBulkTodos(todosWithUser);
//     return {
//       count: created.length,
//       todos: created,
//     };
//   } catch (error) {
//            throw new ApiError(
//       HTTP_STATUS.INTERNAL_SERVER_ERROR,
//       "Bulk todo creation failed",
//     );
//   }
// }
// }
