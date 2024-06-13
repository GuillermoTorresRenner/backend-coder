// Este archivo define una clase para manejar operaciones de base de datos relacionadas con usuarios, como registro, obtención y actualización de usuarios.

import usersModel from "../model/users.model.js";
import PasswordManagement from "../utils/passwordManagement.js";

export default class UsersDao {
  // Registra un nuevo usuario en la base de datos.
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

  // Obtiene un usuario por su correo electrónico.
  static async getUserByEmail(email) {
    return usersModel.findOne({ email }).lean();
  }

  // Obtiene un usuario por su ID.
  static async getUserByID(_id) {
    return usersModel
      .findOne(
        { _id },
        { first_name: 1, last_name: 1, email: 1, age: 1, role: 1, cartId: 1 }
      )
      .lean();
  }

  // Obtiene el rol de un usuario por su ID.
  static async getRoleByID(_id) {
    return usersModel.findOne({ _id }, { role: 1 }).lean();
  }

  // Restaura la contraseña de un usuario utilizando su correo electrónico.
  static async restorePasswordWithEmail(email, password) {
    const user = await usersModel.findOne({ email }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }

  // Restaura la contraseña de un usuario utilizando su ID.
  static async restorePasswordWithID(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }

  // Valida si una nueva contraseña es diferente a la actual.
  static async validateNewPassword(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();
    const result = !PasswordManagement.validatePassword(
      password,
      user.password
    );
    return result;
  }

  // Obtiene el ID de un usuario por su correo electrónico.
  static async getusersIdByEmail(email) {
    return usersModel.findOne({ email }, { _id: 1 }).lean();
  }

  // Obtiene el correo electrónico de un usuario por su ID.
  static async getusersEmailById(_id) {
    return usersModel.findOne({ _id }, { email: 1 }).lean();
  }

  // Cambia el rol de un usuario.
  static async changeRole(_id) {
    const usersRole = await this.getRoleByID(_id);
    let role;
    if (usersRole.role === "PREMIUM") role = "USER";
    if (usersRole.role === "USER") role = "PREMIUM";
    if (usersRole.role === "ADMIN") role = "ADMIN";
    return usersModel.findByIdAndUpdate(
      { _id },
      { $set: { role } },
      { new: true }
    );
  }

  // Actualiza la última conexión de un usuario.
  static updateLastConnection(_id) {
    return usersModel.findByIdAndUpdate(
      { _id },
      { last_connection: new Date() },
      { new: true }
    );
  }

  // Añade un documento al usuario.
  static addDocument(_id, document) {
    return usersModel.findByIdAndUpdate(
      { _id },
      { $push: { documents: document } },
      { new: true }
    );
  }

  // Obtiene los documentos de un usuario por su ID.
  static async getUsersDocumentById(_id) {
    return usersModel.findOne({ _id }, { documents: 1 }).lean();
  }

  // Obtiene todos los usuarios.
  static async getAllUsers() {
    return usersModel
      .find({}, { first_name: 1, last_name: 1, email: 1, role: 1 })
      .lean();
  }

  // Elimina cuentas inactivas basadas en la cantidad de días de inactividad.
  static async deleteInactiveAccounts(diasInactividad = 2) {
    const limitTime = new Date(
      Date.now() - diasInactividad * 24 * 60 * 60 * 1000
    );
    return usersModel.deleteMany({
      last_connection: { $lt: new Date(limitTime) },
    });
  }

  // Elimina un usuario por su correo electrónico.
  static async deleteUserByEmail(email) {
    return usersModel.findOneAndDelete({ email });
  }

  // Actualiza el rol de un usuario por su correo electrónico.
  static updateRoleByEmail(email, role) {
    return usersModel.findOneAndUpdate(
      { email },
      { $set: { role } },
      { new: true }
    );
  }

  // Añade un carrito a un usuario.
  static addCartToUser(userId, cartId) {
    return usersModel.findByIdAndUpdate(
      { _id: userId },
      { cartId },
      { new: true }
    );
  }

  // Obtiene el ID del carrito de un usuario.
  static async getCartIDByUserID(userId) {
    const user = await usersModel
      .findOne({ _id: userId }, { cartId: 1 })
      .lean();
    return user ? user.cartId : null;
  }

  // Elimina el carrito de un usuario.
  static removeCartToUser(userId) {
    return usersModel.findByIdAndUpdate(
      userId,
      { $set: { cartId: null } },
      { new: true }
    );
  }

  // Mueve el carrito a carritos antiguos de un usuario.
  static async moveCartToOldCarts(userId, cartId) {
    const user = await usersModel.findOne({ _id: userId }).lean();
    user.oldCars.push({ carId: cartId });
    return usersModel.findByIdAndUpdate(
      { _id: userId },
      { oldCars: user.oldCars },
      { new: true }
    );
  }
}
