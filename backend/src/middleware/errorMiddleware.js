import { HTTP_STATUS } from "../shared/constant.js";
import { env } from "./../config/env.js";

export const errorMiddleware = (err, _req, res, _next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || "internal server error";
  let errors = err.errors || [];

  if (err.name === "CastError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = `invalid ${err.path}: ${err.value}`;
  }
  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(err.keyValue).join(", ");
    message = `duplicate value for ${field}`;
  }
  if (err.name === "ValidationError") {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = "validation failed";
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = "invalid token, haha";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = "token expired";
  }
  if (statusCode >= 500) {
    console.error({ err }, message);
  }

  if (
    env.NODE_ENV === "production" &&
    statusCode === 500 &&
    !err.isOperational
  ) {
    message = "internal server error";
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
