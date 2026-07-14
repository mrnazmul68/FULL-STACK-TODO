import z from "zod";
import { PAGINATION, VALIDATION } from "../../../shared/constant.js";
import {
  VALID_PRIORITY_STATUS,
  VALID_TODO_STATUS,
} from "../../../shared/enums.js";

const bodyField = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(
      VALIDATION.TITLE_MAX_LENGTH,
      `Title cannot be greater than ${VALIDATION.TITLE_MAX_LENGTH} characters`,
    ),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(
      VALIDATION.DESCRIPTION_MAX_LENGTH,
      `Description cannot be greater than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`,
    ),
  status: z
    .enum(VALID_TODO_STATUS, {
      message: `status must be one of ${VALID_TODO_STATUS.join(", ")}`,
    })
    .optional(),
  priority: z
    .enum(VALID_PRIORITY_STATUS, {
      message: `priority must be one of ${VALID_PRIORITY_STATUS.join(", ")}`,
    })
    .optional(),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
});

// single todoValidationSchema
export const todoValidationSchema = z.object({
  body: bodyField,
});

//bulkTodosValidationSchema
export const bulkTodosValidationSchema = z.object({
  body: z.object({
    todos: z
      .array(bodyField)
      .min(1, "Todos array cannot be empty")
      .max(
        VALIDATION.BULK_TODOD_MAX_LENGTH,
        `You can't create more than ${VALIDATION.BULK_TODOD_MAX_LENGTH} todos together`,
      ),
  }),
});

//getTodosQuerySchema
export const getTodosQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) =>
        val !== undefined ? parseInt(val, 10) : PAGINATION.DEFAULT_PAGE,
      )
      .pipe(z.number().int().min(1, "Page must be at least 1")),
    limit: z
      .string()
      .optional()
      .transform((val) =>
        val !== undefined ? parseInt(val, 10) : PAGINATION.DEFAULT_LIMIT,
      )
      .pipe(
        z
          .number()
          .int()
          .min(1, "Limit must be at least 1")
          .max(
            PAGINATION.MAX_LIMIT,
            `Limit cannot exceed ${PAGINATION.MAX_LIMIT}`,
          ),
      ),
    status: z
      .enum(VALID_TODO_STATUS, {
        message: `status must be one of: ${VALID_TODO_STATUS.join(", ")}`,
      })
      .optional(),
    priority: z
      .enum(VALID_PRIORITY_STATUS, {
        message: `priority must be one of: ${VALID_PRIORITY_STATUS.join(", ")}`,
      })
      .optional(),
    search: z
      .string()
      .trim()
      .min(1, "Search query cannot be empty if provided")
      .max(100, "Search query cannot exceed 100 characters")
      .optional(),
    overdue: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => (val === undefined ? undefined : val === "true")),
    sortBy: z
      .enum(["createdAt", "dueDate", "priority", "title"], {
        message: "sortBy must be one of: createdAt, dueDate, priority, title",
      })
      .optional()
      .default("createdAt"),
    sortOrder: z
      .enum(["asc", "desc"], {
        message: "sortOrder must be one of: asc, desc",
      })
      .optional()
      .default("desc"),
  }),
});

