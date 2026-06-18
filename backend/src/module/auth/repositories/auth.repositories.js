import { User } from "./../model/userModel.js";

export class UserRepository {
  constructor(model = User) {
    this.model = model;
  }
  async createUser(userData) {
    return await this.model.create(userData);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email }).select("+password");
  }

  async findById(id, selectField = "") {
    return await this.model.findOne({_id : id}).select(selectField);
  }
}
