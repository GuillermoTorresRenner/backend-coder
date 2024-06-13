// Este archivo define una clase para manejar operaciones de restauración de datos, como crear y eliminar registros de restauración.

import restoreModel from "../model/restore.model.js";
import { v4 as uuidv4 } from "uuid";

export default class RestoreDao {
  // Crea o actualiza un registro de restauración para un usuario, generando un nuevo hash único.
  static async createNewRestore(userId) {
    return restoreModel.findOneAndUpdate(
      { user: userId },
      { createdAt: Date.now(), hash: uuidv4() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Obtiene un registro de restauración por su hash único.
  static async getRestoreByHash(hash) {
    return restoreModel.findOne({ hash }).lean();
  }

  // Elimina un registro de restauración por su hash único.
  static async deleteRestoreByHash(hash) {
    return restoreModel.deleteOne({ hash });
  }
}
