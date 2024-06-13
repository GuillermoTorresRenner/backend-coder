// Este archivo define una clase para manejar operaciones de base de datos relacionadas con tickets, como crear y obtener tickets.

import TicketsModel from "../model/tickets.model.js";

export default class TicketsDao {
  // Crea un nuevo ticket en la base de datos y lo devuelve.
  static async createNewTicket(ticket) {
    return await TicketsModel.create(ticket);
  }

  // Obtiene un ticket por su ID y lo devuelve.
  static async getTicketByID(_id) {
    return TicketsModel.findOne({ _id }).lean();
  }
}
