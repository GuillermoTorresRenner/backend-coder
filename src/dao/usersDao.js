import usersModel from "../model/users.model.js";
import PasswordManagement from "../utils/passwordManagement.js";
export default class UsersDao {
  static async register(first_name, last_name, email, age, password, role) {
    password = PasswordManagement.hashPassword(password);
    return usersModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });
  }
  static async getUserByEmail(email) {
    return usersModel.findOne({ email }).lean();
  }
  static async getUserByID(_id) {
    return usersModel
      .findOne({ _id }, { first_name: 1, last_name: 1, email: 1, age: 1 })
      .lean();
  }
  static async getRoleByID(_id) {
    return usersModel.findOne({ _id }, { role: 1 }).lean();
  }
  static async restorePasswordWithEmail(email, password) {
    const user = await usersModel.findOne({ email }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }
  static async restorePasswordWithID(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }
  static async validateNewPassword(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();

    const result = !PasswordManagement.validatePassword(
      password,
      user.password
    );

    return result;
  }
  static async getusersIdByEmail(email) {
    return usersModel.findOne({ email }, { _id: 1 }).lean();
  }
  static async getusersEmailById(_id) {
    return usersModel.findOne({ _id }, { email: 1 }).lean();
  }
  static async changeRole(_id) {
    const usersRole = await this.getRoleByID(_id);
    let role;
    if (usersRole.role === "PREMIUM") role = "USER";
    if (usersRole.role === "USER") role = "PREMIUM";
    if (usersRole.role === "ADMIN") role = "ADMIN";
    console.log(usersRole.role);
    console.log("nuevo rol: ", role);

    return usersModel.findByIdAndUpdate(
      { _id },
      { $set: { role } },
      {
        new: true,
      }
    );
  }
  static updateLastConnection(_id) {
    return usersModel.findByIdAndUpdate(
      { _id },
      { last_connection: new Date() },
      { new: true }
    );
  }
  static addDocument(_id, document) {
    return usersModel.findByIdAndUpdate(
      { _id },
      { $push: { documents: document } },
      { new: true }
    );
  }

  static async getUsersDocumentById(_id) {
    return usersModel.findOne({ _id }, { documents: 1 }).lean();
  }
}
