import UsersDao from "../dao/usersDao.js";

export default class UsersRepository {
  // Registra un nuevo usuario
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

  // Obtiene un usuario por su correo electrónico
  static async getUserByEmail(email) {
    return await UsersDao.getUserByEmail(email);
  }

  // Obtiene un usuario por su ID
  static async getUserByID(_id) {
    return await UsersDao.getUserByID(_id);
  }

  // Restaura la contraseña de un usuario usando su correo electrónico
  static async restorePasswordWithEmail(email, password) {
    return await UsersDao.restorePasswordWithEmail(email, password);
  }

  // Obtiene el rol de un usuario por su ID
  static async getRoleByID(_id) {
    return UsersDao.getRoleByID(_id);
  }

  // Obtiene el ID de un usuario por su correo electrónico
  static async getusersIdByEmail(email) {
    return UsersDao.getusersIdByEmail(email);
  }

  // Valida una nueva contraseña para un usuario por su ID
  static async validateNewPassword(_id, password) {
    return await UsersDao.validateNewPassword(_id, password);
  }

  // Restaura la contraseña de un usuario usando su ID
  static async restorePasswordWithID(_id, password) {
    return await UsersDao.restorePasswordWithID(_id, password);
  }

  // Obtiene el correo electrónico de un usuario por su ID
  static async getusersEmailById(_id) {
    return UsersDao.getusersEmailById(_id);
  }

  // Cambia el rol de un usuario por su ID
  static async changeRole(_id) {
    return UsersDao.changeRole(_id);
  }

  // Actualiza la última conexión de un usuario
  static async updateUserLastConnection(_id) {
    return UsersDao.updateLastConnection(_id);
  }

  // Añade un documento a un usuario
  static addDocument(uid, document) {
    return UsersDao.addDocument(uid, document);
  }

  // Obtiene los documentos de un usuario por su ID
  static async getUsersDocumentsById(_id) {
    return UsersDao.getUsersDocumentById(_id);
  }

  // Obtiene todos los usuarios
  static async getAllUsers() {
    return await UsersDao.getAllUsers();
  }

  // Elimina cuentas inactivas
  static async deleteInactiveAccounts() {
    return await UsersDao.deleteInactiveAccounts();
  }

  // Elimina un usuario por su correo electrónico
  static async deleteUserByEmail(email) {
    return await UsersDao.deleteUserByEmail(email);
  }

  // Actualiza el rol de un usuario por su correo electrónico
  static updateRoleByEmail(email, role) {
    return UsersDao.updateRoleByEmail(email, role);
  }

  // Añade un carrito a un usuario
  static addCartToUser(userId, cartId) {
    return UsersDao.addCartToUser(userId, cartId);
  }

  // Elimina el carrito de un usuario
  static removeCartToUser(userId) {
    return UsersDao.removeCartToUser(userId);
  }

  // Obtiene el ID del carrito de un usuario
  static getCartIDByUserID(userId) {
    return UsersDao.getCartIDByUserID(userId);
  }

  // Mueve el carrito a carritos antiguos de un usuario
  static async moveCartToOldCarts(userId, cartId) {
    return UsersDao.moveCartToOldCarts(userId, cartId);
  }
}
