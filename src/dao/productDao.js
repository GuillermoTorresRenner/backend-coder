/*
Este archivo contendrá los métodos necesarios para interactuar con la base de datos en la colección de productos.
*/

import productsModel from "../model/products.model.js";
import { UserServices } from "../repositories/Repositories.js";

export default class ProductsDao {
  // Crea un nuevo producto en la base de datos.
  static async createNewProduct(newProduct) {
    return productsModel.create(newProduct);
  }

  // Obtiene todos los productos de la base de datos según los parámetros de consulta, paginación y ordenación.
  static async getAllProducts(
    query = "{}",
    page = 1,
    limit = 10,
    sort = "asc"
  ) {
    query = JSON.parse(query);
    const data = await productsModel.paginate(query, {
      limit,
      page,
      sort,
      lean: true,
    });
    const baseUrl = `/products?query=${JSON.stringify(
      query
    )}&limit=${limit}&sort=${sort}&page=`;
    const res = {
      status: "success",
      payload: data.docs,
      totalPages: data.totalPages,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: data.hasPrevPage ? baseUrl + (data.page - 1) : baseUrl + 1,
      nextLink: data.hasNextPage ? baseUrl + (data.page + 1) : baseUrl + 1,
    };
    return res;
  }

  // Obtiene un producto específico por su ID.
  static async getProductByID(_id) {
    return await productsModel.findOne({ _id }).lean();
  }

  // Obtiene un número limitado de productos de la base de datos.
  static async getAllProductswhitLimits(limit) {
    return productsModel.find().limit(limit).lean();
  }

  // Actualiza la información de un producto específico por su ID.
  static async updateProduct(_id, modifiedProduct) {
    return productsModel.findByIdAndUpdate(_id, modifiedProduct, {
      new: true,
    });
  }

  // Elimina un producto específico por su ID de la base de datos.
  static async deleteProduct(_id) {
    return productsModel.findByIdAndDelete({ _id });
  }

  // Obtiene productos por un conjunto de IDs.
  static async getProductsByManyIDs(ids) {
    return await productsModel.find({ _id: { $in: ids } });
  }

  // Actualiza la cantidad en stock de un producto específico.
  static async consumeStock(_id, newQuantity) {
    return productsModel.findOneAndUpdate(
      { _id },
      { $set: { stock: newQuantity } },
      { new: true }
    );
  }

  // Obtiene el propietario de un producto específico por su ID.
  static async getProductOwnerById(_id) {
    return await productsModel.findOne({ _id }, { owner: 1 });
  }

  // Obtiene el ID de un producto por su código.
  static async getProductsIdByCode(code) {
    return await productsModel.findOne({ code }, { _id: 1 });
  }

  // Obtiene los productos de un propietario específico por su ID.
  static async getOwnersProductsById(ownerId) {
    const user = await UserServices.getUserByID(ownerId);
    const usersEmail = user.email;
    const payload = await productsModel.find({ owner: usersEmail }).lean();
    return { payload };
  }
}
