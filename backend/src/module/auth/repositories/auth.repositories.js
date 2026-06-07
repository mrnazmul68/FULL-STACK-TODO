import { User } from "./../model/userModel.js";

export const userAuthRepositories = () => {
  return {
    create: async (userData) => {
      const user = await User.create(userData);
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    },
  };
};
