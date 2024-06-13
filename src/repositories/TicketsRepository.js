/*
 * Este archivo contiene las interacciones con el DAO de tickets.
 */

import TicketsDao from "../dao/TicketDao.js";
export default class TicketsRepository {
  // Crea un nuevo ticket
  static async createNewTicket(ticket) {
    return await TicketsDao.createNewTicket(ticket);
  }

  // Obtiene un ticket por ID
  static async getTicketByID(_id) {
    return await TicketsDao.getTicketByID(_id);
  }
}
