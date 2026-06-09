import z from "zod";
import { VALIDATION } from "../../../shared/constant.js";
import { TODO_STATUS, VALID_TODO_STATUS } from "../../../shared/enums.js";

export const todoValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(
        VALIDATION.TITLE_MAX_LENGTH,
        `Title cannot be gratter then ${VALIDATION.TITLE_MAX_LENGTH} charrecters`,
      ),
    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(
        VALIDATION.DESCRIPTION_MAX_LENGTH,
        `Description cannot be gratter then ${VALIDATION.DESCRIPTION_MAX_LENGTH} charrecters`,
      ),
    status: z
      .enum(VALID_TODO_STATUS, {
        message: `Status must be one of ${VALID_TODO_STATUS.join(", ")}`,
      })
      .optional(),
  }),
});
