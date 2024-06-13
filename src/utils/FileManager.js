import { promises as fs } from "fs";
import Logger from "./Logger";
class FileManager {
  constructor(path) {
    this.path = path;
  }

  // Guarda datos en un archivo, convirtiendo el objeto a una cadena JSON
  saveInFile = async (data) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(data));
    } catch (error) {
      // Registra un error si falla la escritura en el archivo
      Logger.error("Ocurrió un error guardando datos en el archivo: ", error);
    }
  };

  // Obtiene datos desde un archivo, convirtiendo la cadena JSON a un objeto
  getFromFile = async () => {
    try {
      const savedData = await fs.readFile(this.path, "utf-8");
      return JSON.parse(savedData);
    } catch (error) {
      // Registra un error si falla la lectura del archivo
      Logger.error("Error obteniendo datos desde archivo:", error);
    }
  };

  // Obtiene un elemento por ID desde los datos almacenados en el archivo
  getFromFileByID = async (id) => {
    try {
      const savedData = await this.getFromFile();
      const foundedData = savedData.find((p) => p.id === id);
      return foundedData ? foundedData : `No existe un item con id: ${id}`;
    } catch (error) {
      // Registra un error si falla la búsqueda de un elemento por ID
      Logger.error("Error obteniendo datos desde archivo:", error);
    }
  };

  // Obtiene una cantidad limitada de elementos desde los datos almacenados en el archivo
  getFromFileWithLimit = async (limit) => {
    try {
      const savedData = await this.getFromFile();
      return savedData.slice(0, limit);
    } catch (error) {
      // Registra un error si falla la obtención de datos con un límite especificado
      Logger.error("Error obteniendo datos desde archivo:", error);
    }
  };

  // Elimina un elemento por ID de los datos almacenados en el archivo
  deleteInFile = async (id) => {
    try {
      const savedData = await this.getFromFile();
      const newList = savedData.filter((p) => p.id !== id);
      this.products = newList;
      await this.saveInFile(this.products);
    } catch (error) {
      // Registra un error si falla la eliminación de un elemento por ID
      Logger.error(
        "Ocurrió un error eliminando un registro desde archivo",
        error
      );
    }
  };

  // Actualiza un elemento por ID con nuevos valores en los datos almacenados en el archivo
  updateInFile = async (id, newValue) => {
    try {
      const savedData = await this.getFromFile();
      const updatedList = savedData.map((p) =>
        p.id === id ? { ...p, ...newValue } : p
      );

      await this.saveInFile(updatedList);
    } catch (error) {
      // Registra un error si falla la actualización de un elemento por ID
      Logger.error(
        "Ocurrió un error actualizando un registro en el archivo:",
        error
      );
    }
  };
}
export default FileManager;
