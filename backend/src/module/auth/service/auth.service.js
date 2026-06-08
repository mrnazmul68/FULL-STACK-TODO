import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt.js";
import { userAuthRepositories } from "../repositories/auth.repositories.js";

export const createAuthService = (userRepositorie = userAuthRepositories()) => {
  const generateTokenPair = async (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    return {
      accessToken,
      refreshToken,
    };
  };
  return {
    register: async ({ name, email, password }) => {
      const user = await userRepositorie.create({ name, email, password });
      const token = await generateTokenPair(user._id);
      return {
        user,
        ...token,
      };
    },
  };
};
