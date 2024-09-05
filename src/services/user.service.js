import UserModel from "../models/user.model.js";

class UserService {
  // create new user
  async createUser(userData) {
    const newUser = await UserModel.create(userData);
    return newUser;
  }

  // retrieve one user
  async findUser(query) {
    const user = await UserModel.findOne(query);
    return user;
  }

  // retrieve all users
  async findUsers(query) {
    const users = await UserModel.find(query);
    return users;
  }

  // update user
  async updateUser(query, data) {
    const updatedUser = await UserModel.findOneAndUpdate(query, data, {
      new: true,
    });
    return updatedUser;
  }

  // delete user
  async delUser(query) {
    const deletedUser = await UserModel.findOneAndDelete(query);
    return deletedUser;
  }
}

export default new UserService();