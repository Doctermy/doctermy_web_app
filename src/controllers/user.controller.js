import UserService from "../services/user.service.js";
import { USER_TYPES } from "../utils/user.js";

class UserController {
  //find a user
  async findUser(req, res) {
    const query = { _id: req.params.id };

    const user = await UserService.findUser(query);

    return res.status(200).send({
      success: true,
      message: "User successfully retrieved",
      data: user,
    });
  }

  //find all users
  async findUsers(req, res) {
    const { query } = req;

    const users = await UserService.findUsers(query);

    return res.status(200).send({
      success: true,
      message: "All users successfully retrieved",
      data: users,
    });
  }

  //update user
  async updateUser(req, res) {
    const { _id: userId, role: userType } = req.user; // can rewrite this line of code as the two below
    // const userId = req.user._id;
    // const userType = req.user.role;
    const { body } = req;
    const query = { _id: req.params.id };

    // Check if the user exists
    const user = await UserService.findUser(query);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User does not exist",
      });
    }

    // Check if the current user is authorized to update this user
    if (
      [USER_TYPES.PATIENT, USER_TYPES.DOCTOR].includes(userType) &&
      user._id.toString() !== userId.toString()
    ) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedUser = await UserService.updateUser(query, body);
    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  }

  //delete user
  async delUser(req, res) {
    const { _id: userId, role: userType } = req.user;
    const query = { _id: req.params.id };

    // Check if the user exists
    const user = await UserService.findUser(query);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User does not exist",
      });
    }

    if (userType === USER_TYPES.PATIENT || userType === USER_TYPES.DOCTOR) {
      if (user._id.toString() !== userId.toString()) {
        return res.status(403).send({
          success: false,
          message: "Unauthorized access",
        });
      }
    }

    const deletedUser = await UserService.delUser(query);
    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  }
}

export default new UserController();