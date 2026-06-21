import z from "zod";
import { VALIDATION } from "../../../shared/constant.js";
import { TODO_STATUS, VALID_TODO_STATUS } from "../../../shared/enums.js";

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
      message: `Status must be one of ${VALID_TODO_STATUS.join(", ")}`,
    })
    .optional(),
});

export const todoValidationSchema = z.object({
  body: bodyField,
});

export const bulkTodosValidationSchema  = z.object({
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
