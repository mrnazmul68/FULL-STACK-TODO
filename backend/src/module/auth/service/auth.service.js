import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwt.js";
import { userAuthRepositories } from "../repositories/auth.repositories.js";
import bcrypt from "bcrypt";

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
      const tokens = await generateTokenPair(user._id);
      return {
        user,
        ...tokens,
      };
    },
    login: async ({ email, password }) => {
      const user = await userRepositorie.findByEmail(email);

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      const { password: _, ...loginUserWithoutPassword } = user;

      const tokens = generateTokenPair(user._id);

      return {
        user: loginUserWithoutPassword,
        ...tokens,
      };
    },
  };
};
