import { asyncHandler } from "./../utils/asyncHandler";
import { ApiError } from "./../utils/ApiError";
import { HTTP_STATUS } from "../shared/constant";
import { verifyAccessToken } from "../utils/jwt";
import { UserRepository } from "../module/auth/repositories/auth.repositories";

const userRepository = new UserRepository();

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Unauthorized request and token not found",
    );
  }

  const token = authHeader.split(" ").at(1);
  const decoded = verifyAccessToken(token);
  const user = await userRepository.findById(decoded.id, "-password -__v");
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Unauthorized user and user not found",
    );
  }
  req.user = user;
  next();
});
