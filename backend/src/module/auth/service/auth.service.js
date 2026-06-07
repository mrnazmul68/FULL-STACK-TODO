import { userAuthRepositories } from "../repositories/auth.repositories.js";

export const createAuthService = (userRepositorie = userAuthRepositories()) => {
  return {
    register: async ({name, email, password}) => {
      const user = await userRepositorie.create({ name, email, password });
      return user
    },
  };
};
