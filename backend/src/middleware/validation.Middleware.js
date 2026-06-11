import { ZodError } from "zod";
import { HTTP_STATUS } from "../shared/constant";
import { ApiError } from "../utils/ApiError";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
    });

    if ("body" in parsed) req.body = parsed.body;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.length ? err.path.join(".") : "unknown",
        message: err.message,
      }));

      return next(
        new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Validation Failed",
          errors,
        ),
      );
    } 
    return next(error)
  }
};
