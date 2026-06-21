import { HTTP_STATUS } from "../shared/constant.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { ZodError } from "zod";

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
        field: err.path.length ? err.path.join(".") : "Unknown",
        message: err.message,
      }));
      return new ApiResponse(
        HTTP_STATUS.BAD_REQUEST,
        errors,
        "Validation error",
      ).send(res);
    }
    return next(error);
  }
};
