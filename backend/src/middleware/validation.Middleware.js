import { HTTP_STATUS } from "../shared/constant.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const input = {};

    if ("body" in req) input.body = req.body;
    if ("query" in req) input.query = req.query;
    if ("params" in req) input.params = req.params;

    const parsed = schema.parse(input);

    if ("body" in parsed) req.body = parsed.body;
    if ("query" in parsed) Object.assign(req.query, parsed.query);
    if ("params" in parsed) Object.assign(req.params, parsed.params);

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.length ? err.path.join(".") : "unknown",
        message: err.message,
      }));
      return new ApiResponse(
        HTTP_STATUS.BAD_REQUEST,
        { errors },
        "Validation failed",
      ).send(res);
    }
    return next(error);
  }
};
