/**
 * Repositorio de carritos de compras.
 */

import CartDao from "../dao/cartDao.js";

export default class CartRepository {
  // Crea un nuevo carrito de compras.
  static async createNewcart() {
    const cart = await CartDao.createNewcart();
    return cart;
  }

  // Añade un producto al carrito especificado por su ID.
  static async addToCart(_id, pid, quantity) {
    return await CartDao.addToCart(_id, pid, quantity);
  }

  // Obtiene un carrito de compras por su ID.
  static async getCartByID(cid) {
    return await CartDao.getCartByID(cid);
  }

  // Elimina un producto específico de un carrito por sus IDs.
  static async deleteCartProductByID(cartID, productID) {
    return await CartDao.deleteCartProductByID(cartID, productID);
  }

  // Elimina un carrito de compras por su ID.
  static async deleteCartByID(cartID) {
    return await CartDao.deleteCartByID(cartID);
  }

  // Actualiza la información de un carrito de compras por su ID.
  static async updateCartByID(cartID, newData) {
    return await CartDao.updateCartByID(cartID, newData);
  }

  // Actualiza la cantidad de un producto específico en un carrito.
  static async updateCartProductsByID(cartID, productID, quantity) {
    return await CartDao.updateCartProductsByID(cartID, productID, quantity);
  }

  // Procesa la compra de los productos en el carrito especificado por su ID.
  static async purchase(cartID) {
    const cart = await CartDao.purchase(cartID);
    return cart;
  }
}
