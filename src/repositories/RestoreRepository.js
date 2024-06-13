/*
 * Archivo encargado de la comunicación con la capa de acceso a datos (DAO) para la entidad de restauración.
 */

import RestoreDao from "../dao/restore.Dao.js";

export default class RestoreRepository {
  // createNewRestore: Crea un nuevo registro de restauración para un usuario específico.
  static async createNewRestore(userId) {
    return RestoreDao.createNewRestore(userId);
  }

  // getRestoreByHash: Obtiene un registro de restauración específico por su hash.
  static async getRestoreByHash(hash) {
    return RestoreDao.getRestoreByHash(hash);
  }

  // deleteRestoreByHash: Elimina un registro de restauración específico por su hash.
  static async deleteRestoreByHash(hash) {
    return RestoreDao.deleteRestoreByHash(hash);
  }
}
