import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiError } from "../../../utils/ApiError.js";
import { toObjectId } from "../../../utils/toObjectId.js";
import { toPlainObjects } from "../../../utils/toPlainObjects.js";
import { title_collation, Todo } from "../model/todo.model.js";

const DEFAULT_SORT = { createdAt: -1 };

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

  //find with pagination, filtering, search, and dynamic sort
  async findWithPagination(
    query,
    { page, limit, sort = DEFAULT_SORT, search = null },
  ) {
    // Coerce to numbers (validation layer ensures they are valid, but be safe)
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    if (!Number.isInteger(pageNum) || !Number.isInteger(limitNum)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Invalid pagination parameters: page=${page}, limit=${limit}`,
      );
    }

    const skip = (pageNum - 1) * limitNum;

    // ── Atlas Search path (full-text / autocomplete) ───────────────────────
    if (search) {
      const matchQuery = { ...query };
      if (matchQuery.user) {
        matchQuery.user = toObjectId(matchQuery.user, "User ID");
      }

      const searchStage = {
        $search: {
          index: "todo_autocomplete",
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "title",
                  fuzzy: { maxEdits: 1 },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "description",
                  fuzzy: { maxEdits: 1 },
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      };

      const basePipeline = [searchStage, { $match: matchQuery }];

      const [searchResults, countResult] = await Promise.all([
        this.model.aggregate([
          ...basePipeline,
          ...(sort ? [{ $sort: sort }] : []),
          { $skip: skip },
          { $limit: limitNum },
        ]),
        this.model.aggregate([...basePipeline, { $count: "total" }]),
      ]);

      const total = countResult[0]?.total ?? 0;
      return { todos: searchResults.map(toPlainObjects), total };
    }

    // ── Standard query path (filters only, no search) ─────────────────────
    const [todos, total] = await Promise.all([
      this.model
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean()
        .collation(title_collation),
      this.model.countDocuments(query),
    ]);

    return { todos: todos.map(toPlainObjects), total };
  }
}
