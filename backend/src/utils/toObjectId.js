import { Types } from "mongoose";
import { ApiError } from "./ApiError.js";
import { HTTP_STATUS } from "../shared/constant.js";

export const toObjectId = (id, label = "ID") => {
  if (!id) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, `${label} is required`);
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Invalid ${label}: "${id}" is not a valid ObjectId`,
    );
  }
  return new Types.ObjectId(id);
};
