import { z } from "zod";
import { VALIDATION } from "../../../shared/constant.js";

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .toLowerCase()
  .max(
    VALIDATION.EMAIL_MAX_LENGTH,
    `Email must be at most ${VALIDATION.EMAIL_MAX_LENGTH} characters long`,
  )
  .pipe(z.email("Invalid email format"));
const passwordField = z
  .string()
  .min(
    VALIDATION.PASSWORD_MIN_LENGTH,
    `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
  )
  .max(
    VALIDATION.PASSWORD_MAX_LENGTH,
    `Password must be at most ${VALIDATION.PASSWORD_MAX_LENGTH} characters long`,
  );

// register validation schema
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(
        VALIDATION.NAME_MIN_LENGTH,
        `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters long`,
      )
      .max(
        VALIDATION.NAME_MAX_LENGTH,
        `Name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters long`,
      ),
    email: emailField,
    password: passwordField,
  }),
});

//login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: emailField,
    password: passwordField,
  }),
});
