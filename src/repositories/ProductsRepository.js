/*
  El repositorio de productos es el encargado de comunicarse con la capa de acceso a datos (DAO) de productos.
  */

import ProductsDao from "../dao/productDao.js";

export default class ProductsRepository {
  // createNewProduct: Crea un nuevo producto en la base de datos.
  static async createNewProduct(newProduct) {
    return await ProductsDao.createNewProduct(newProduct);
  }

  // getAllProducts: Obtiene todos los productos de la base de datos según los parámetros de consulta, paginación y ordenación.
  static async getAllProducts(query, page, limit, sort) {
    return await ProductsDao.getAllProducts(query, page, limit, sort);
  }

  // getProductByID: Obtiene un producto específico por su ID.
  static async getProductByID(_id) {
    return await ProductsDao.getProductByID(_id);
  }

  // getAllProductswhitLimits: Obtiene todos los productos de la base de datos limitando la cantidad de resultados.
  static async getAllProductswhitLimits(limit) {
    return await ProductsDao.getAllProductswhitLimits(limit);
  }

  // updateProduct: Actualiza la información de un producto específico por su ID.
  static async updateProduct(_id, modifiedProduct) {
    return await ProductsDao.updateProduct(_id, modifiedProduct);
  }

  // deleteProduct: Elimina un producto específico por su ID de la base de datos.
  static async deleteProduct(_id) {
    return await ProductsDao.deleteProduct(_id);
  }

  // getProductsByManyIDs: Obtiene productos específicos por una lista de IDs.
  static async getProductsByManyIDs(ids) {
    return await ProductsDao.getProductsByManyIDs(ids);
  }

  // consumeStock: Reduce el stock de un producto específico por su ID.
  static async consumeStock(_id, newQuantity) {
    return await ProductsDao.consumeStock(_id, newQuantity);
  }

  // getProductOwnerById: Obtiene el propietario de un producto específico por su ID.
  static async getProductOwnerById(_id) {
    return await ProductsDao.getProductOwnerById(_id);
  }

  // getProductsIdByCode: Obtiene los IDs de productos específicos por su código.
  static async getProductsIdByCode(code) {
    return await ProductsDao.getProductsIdByCode(code);
  }

  // getOwnersProductsById: Obtiene los productos de un propietario específico por su ID.
  static async getOwnersProductsById(ownerId) {
    return await ProductsDao.getOwnersProductsById(ownerId);
  }
}
