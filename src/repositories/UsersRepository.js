import e from "express";
import UsersDao from "../dao/usersDao.js";
import UserDTO from "../dto/users.dto.js";

export default class UsersRepository {
  static async register(first_name, last_name, email, age, password) {
    return await UsersDao.register(first_name, last_name, email, age, password);
  }
  static async getUserByEmail(email) {
    const user = await UsersDao.getUserByEmail(email);
    return UserDTO.getUser(user);
  }
  static async getUserByID(_id) {
    const user = await UsersDao.getUserByID(_id);
    return UserDTO.getUser(user);
  }
  static async restorePasswordWithEmail(email, password) {
    return await UsersDao.restorePasswordWithEmail(email, password);
  }
}
