import { z } from "zod";
import { validation } from "../../../shared/constants.js";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(
        validation.NAME_MIN_LENGTH,
        `Name must be at least ${validation.NAME_MIN_LENGTH} characters long`,
      )
      .max(
        validation.NAME_MAX_LENGTH,
        `Name must be at most ${validation.NAME_MAX_LENGTH} characters long`,
      ),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(
        validation.EMAIL_MAX_LENGTH,
        `Email must be at most ${validation.EMAIL_MAX_LENGTH} characters long`,
      )
      .pipe(z.email("Invalid email format")),

    password: z
      .string()
      .min(
        validation.PASSWORD_MIN_LENGTH,
        `Password must be at least ${validation.PASSWORD_MIN_LENGTH} characters long`,
      )
      .max(
        validation.PASSWORD_MAX_LENGTH,
        `Password must be at most ${validation.PASSWORD_MAX_LENGTH} characters long`,
      ),
  }),
});
