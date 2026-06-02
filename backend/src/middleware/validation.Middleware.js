import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../shared/constants.js";

const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if ("body" in parsedData) req.body = parsedData.body;
    if ("query" in parsedData) req.query = parsedData.query;
    if ("params" in parsedData) req.params = parsedData.params;

    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.length ? err.path.join(".") : "unknown",
        message: err.message,
      }));

      return next(
        new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Validation failed",
          true,
          JSON.stringify(errors),
        ),
      );
    }

    return next(error);
  }
};

export default validate;
