
import { User } from "./../model/userModel.js";

export class UserRepository {
  constructor(model = User) {
    this.model = model;
  }

  async findByEmail(email) {
    return await this.model.findOne({ email }).select("+password");
    //    ^^^^^^^^^^
    //    এটাই User
  }
}

// import { User } from "./../model/userModel.js";

// export const userAuthRepositories = () => {
//   return {
//     create: async (userData) => {
//       const user = await User.create(userData);
//       const { password, ...userWithoutPassword } = user.toObject();
//       return userWithoutPassword;
//     },
//     findById: async (id) => {
//       return User.findById(id);
//     },
//     findByEmail: async (email) => {
//       return User.findOne({ email }).select("+password").lean();
//     },
//   };
// };
