import CartDao from "../dao/cartDao.js";
import UsersRepository from "./UsersRepository.js";
export default class CartRepository {
  static async createNewcart() {
    const cart = await CartDao.createNewcart();
    return cart;
  }
  static async addToCart(_id, pid, quantity) {
    return await CartDao.addToCart(_id, pid, quantity);
  }
  static async getCartByID(cid) {
    return await CartDao.getCartByID(cid);
  }

  static async deleteCartProductByID(cartID, productID) {
    return await CartDao.deleteCartProductByID(cartID, productID);
  }
  static async deleteCartByID(cartID) {
    return await CartDao.deleteCartByID(cartID);
  }
  static async updateCartByID(cartID, newData) {
    return await CartDao.updateCartByID(cartID, newData);
  }
  static async updateCartProductsByID(cartID, productID, quantity) {
    return await CartDao.updateCartProductsByID(cartID, productID, quantity);
  }
  static async purchase(cartID) {
    const cart = await CartDao.purchase(cartID);
    return cart;
  }
}
