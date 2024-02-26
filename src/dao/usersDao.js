import usersModel from "./model/users.model.js";
import bcrypt from "bcrypt";
export default class UsersDao {
  static async register(first_name, last_name, email, age, password) {
    password = bcrypt.hashSync(password, 10);
    return usersModel.create({ first_name, last_name, email, age, password });
  }
  static async getUserByEmail(email) {
    return usersModel.findOne({ email }).lean();
  }
  static async getUserByID(_id) {
    return usersModel
      .findOne({ _id }, { first_name: 1, last_name: 1, age: 1, email: 1 })
      .lean();
  }
}
