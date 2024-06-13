/**
 * Repositorio de productos que utiliza el DAO de mocking.
 */

import Mocking from "../dao/mocking.dao.js";

export default class MockingProductsRepository {
  // getProducts: Retorna todos los productos utilizando el DAO de mocking.
  static getProducts() {
    return Mocking.getProducts();
  }
}
