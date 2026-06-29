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
      .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1, "Page must be at least 1")),
    limit: z
      .string()
      .optional()
      .transform((val) => (val !== undefined ? parseInt(val, 10) : 1))
      .pipe(
        z
          .number()
          .int()
          .min(PAGINATION.DEFAULT_PAGE)
          .max(
            PAGINATION.MAX_LIMIT,
            `limit cannot exceed ${PAGINATION.MAX_LIMIT}`,
          ),
      ),
    status: z.enum(VALID_TODO_STATUS).optional(),
    priority: z.enum(VALID_PRIORITY_STATUS).optional(),
    search: z
      .string()
      .trim()
      .max(100, "search query cannot exceed 100 characters")
      .optional(),
    overdue: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => val === "true"),
  }),
});
