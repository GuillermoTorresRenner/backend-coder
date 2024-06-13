/*
Este archivo contendrá los métodos necesarios para interactuar con la base de datos en la colección de carritos.
*/

import cartsModel from "../model/carts.model.js";
import { ProductsServices } from "../repositories/Repositories.js";

export default class CartDao {
  // Crea un nuevo carrito vacío en la base de datos.
  static async createNewcart() {
    return cartsModel.create({});
  }

  // Añade un producto al carrito o incrementa su cantidad si ya existe.
  static async addToCart(_id, pid, quantity) {
    const cart = await cartsModel.findOne({ _id }).lean();

    if (!cart) {
      return "Cart Not Found";
    }

    const product = await cartsModel
      .findOne({ _id, "products.productId": pid })
      .lean();

    if (!product) {
      return cartsModel.findByIdAndUpdate(
        { _id },
        { $push: { products: { productId: pid, quantity } } },
        { new: true }
      );
    } else {
      return cartsModel.findOneAndUpdate(
        { _id, "products.productId": pid },
        { $inc: { "products.$.quantity": quantity } },
        { new: true }
      );
    }
  }

  // Obtiene un carrito por su ID, incluyendo la información detallada de los productos.
  static async getCartByID(_id) {
    const cart = await cartsModel
      .findOne({ _id })
      .populate("products.productId")
      .lean();
    return cart;
  }

  // Elimina un producto específico del carrito.
  static async deleteCartProductByID(cartID, productID) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productID
    );
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  // Elimina un carrito por su ID.
  static async deleteCartByID(cartID) {
    return cartsModel.findByIdAndDelete({ _id: cartID });
  }

  // Actualiza los productos de un carrito con nuevos datos.
  static async updateCartByID(cartID, newData) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = newData;
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  // Actualiza la cantidad de un producto específico en el carrito.
  static async updateCartProductsByID(cartID, productID, quantity) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      (product) => product.productId !== productID
    );
    cart.products.push({ productId: productID, quantity });
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }

  // Procesa la compra de los productos en el carrito, actualizando el stock y calculando el monto total.
  static async purchase(cartID) {
    const cart = await this.getCartByID(cartID);
    const ids = [];

    cart.products.map((p) => ids.push(p.productId));
    let amount = 0;
    const products = await ProductsServices.getProductsByManyIDs(ids);
    const leftiesCart = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].stock >= cart.products[i].quantity) {
        const newQuantity = products[i].stock - cart.products[i].quantity;
        amount += products[i].price * cart.products[i].quantity;
        await ProductsServices.consumeStock(products[i]._id, newQuantity);
      } else {
        leftiesCart.push(cart.products[i].productId._id);
      }
    }

    return { leftiesCart, amount };
  }
}
