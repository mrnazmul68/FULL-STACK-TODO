import { HTTP_STATUS } from "../../../shared/constant.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AuthService } from "../service/auth.service.js";
import { asyncHandler } from "./../../../utils/asyncHandler.js";

const authService = new AuthService();

// Register user
export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(
    req.body,
  );
  new ApiResponse(
    HTTP_STATUS.CREATED,
    { user, accessToken, refreshToken },
    "User created successfully",
  ).send(res);
});

//login
export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  new ApiResponse(
    HTTP_STATUS.OK,
    { user, accessToken, refreshToken },
    "logged in successfully",
  ).send(res);
});
