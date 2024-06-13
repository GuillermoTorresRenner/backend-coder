/**
 * Este archivo contendrá los métodos necesarios para interactuar con la base de datos en la colección de mensajes.
 */

export default class MessagesDao {
  // Método estático para crear un nuevo mensaje en la base de datos.
  static async createNewMessage(message) {
    return MessageModel.create(message);
  }

  // Método estático para obtener todos los mensajes de la base de datos.
  static async getAllMessages() {
    return MessageModel.find().lean();
  }
}
