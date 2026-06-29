import { HTTP_STATUS, PAGINATION } from "../../../shared/constant.js";
import { TODO_STATUS } from "../../../shared/enums.js";
import { ApiError } from "../../../utils/ApiError.js";
import { TodoRepository } from "../repositories/todo.repository.js";

export class TodoService {
  constructor(todoRepo = new TodoRepository()) {
    this.todoRepository = todoRepo;
  }

  // single todo create
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

  //bulk todo create
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
      };
    } catch (error) {
      if (error.name === "MongoBulkWriteError" || error.writeErrors) {
        const inserted = error.insertedDocs || [];
        const errors = (error.writeErrors || []).map((err) => {
          const code = err.err?.code;
          const op = err.err?.op;
          const errmsg = err.err?.errmsg;

          let reason = "Creation failed";

          if (code === 11000) {
            reason = `Todo with title '${op?.title}' already exists`;
          } else if (errmsg) {
            reason = errmsg;
          }

          return {
            index: err.index,
            todo: op,
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

      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error.message || "Bulk todo creation failed",
      );
    }
  }

  //filter system
  static #buildFilterQuery({ status, priority, overdue }, userId) {
    const query = { user: userId };
    if (overdue) {
      query.status = TODO_STATUS.ACTIVE;
      query.dueDate = { $lt: new Date(new Date().setHours(0, 0, 0, 0)) };
    } else {
      if (status) query.status = status;
    }
    if (priority) query.priority = priority;
    return query;
  }

  //get all todos
  async getAll(filters, userId) {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      ...filterQuery
    } = filters;
    const filtersQuery = TodoService.#buildFilterQuery(filterQuery, userId);
    const { todos, total } = await this.todoRepository.findWithPagination(
      filtersQuery,
      { page, limit },
    );
    return {
      todos,
      pagination: {
        total,
        currentPage: page,
      },
    };
  }
}
