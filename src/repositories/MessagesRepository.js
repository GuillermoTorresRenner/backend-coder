/*
  Este archivo contiene la lógica de negocio de los mensajes.
*/

import MessagesDao from "../dao/messagesDao.js";

export default class MessagesRepository {
  // Crea un nuevo mensaje en la base de datos.
  static async createNewMessage(message) {
    return await MessagesDao.createNewMessage(message);
  }

  // Obtiene todos los mensajes de la base de datos.
  static async getAllMessages() {
    return await MessagesDao.getAllMessages();
  }
}
