import { HTTP_STATUS } from "../../../shared/constant.js";
import { createAuthService } from "../service/auth.service.js";
import { asyncHandler } from "./../../../utils/asyncHandler.js";

const authService = createAuthService();

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken } = await authService.register(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    message: "User created successfully",
    user,
    accessToken
  });

});
