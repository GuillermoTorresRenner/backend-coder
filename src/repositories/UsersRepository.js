import UsersDao from "../dao/usersDao.js";

export default class UsersRepository {
  static async register(first_name, last_name, email, age, password, role) {
    return await UsersDao.register(
      first_name,
      last_name,
      email,
      age,
      password,
      role
    );
  }
  static async getUserByEmail(email) {
    return await UsersDao.getUserByEmail(email);
  }
  static async getUserByID(_id) {
    return await UsersDao.getUserByID(_id);
  }
  static async restorePasswordWithEmail(email, password) {
    return await UsersDao.restorePasswordWithEmail(email, password);
  }
  static async getRoleByID(_id) {
    return UsersDao.getRoleByID(_id);
  }
  static async getusersIdByEmail(email) {
    return UsersDao.getusersIdByEmail(email);
  }
  static async validateNewPassword(_id, password) {
    return await UsersDao.validateNewPassword(_id, password);
  }
  static async restorePasswordWithID(_id, password) {
    return await UsersDao.restorePasswordWithID(_id, password);
  }
  static async getusersEmailById(_id) {
    return UsersDao.getusersEmailById(_id);
  }
  static async changeRole(_id) {
    return UsersDao.changeRole(_id);
  }
  static async updateUserLastConnection(_id) {
    return UsersDao.updateLastConnection(_id);
  }
  static addDocument(uid, document) {
    return UsersDao.addDocument(uid, document);
  }
  static async getUsersDocumentsById(_id) {
    return UsersDao.getUsersDocumentById(_id);
  }
  static async getAllUsers() {
    return await UsersDao.getAllUsers();
  }
  static async deleteInactiveAccounts() {
    return await UsersDao.deleteInactiveAccounts();
  }
  static async deleteUserByEmail(email) {
    return await UsersDao.deleteUserByEmail(email);
  }
  static updateRoleByEmail(email, role) {
    return UsersDao.updateRoleByEmail(email, role);
  }
  static addCartToUser(userId, cartId) {
    return UsersDao.addCartToUser(userId, cartId);
  }
  static removeCartToUser(userId) {
    return UsersDao.removeCartToUser(userId);
  }
  static getCartIDByUserID(userId) {
    return UsersDao.getCartIDByUserID(userId);
  }
}
