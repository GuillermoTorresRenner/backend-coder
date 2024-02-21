import cartsModel from "./model/carts.model.js";
export default class CartDao {
  static async createNewcart() {
    return cartsModel.create({});
  }
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
  static async getCartByID(_id) {
    return cartsModel.findOne({ _id }).populate("products.productId").lean();
  }

  static async deleteCartProductByID(cartID, productID) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productID
    );
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }
  static async deleteCartByID(cartID) {
    return cartsModel.findByIdAndDelete({ _id: cartID });
  }
  static async updateCartByID(cartID, newData) {
    const cart = await cartsModel.findOne({ _id: cartID }).lean();
    cart.products = newData;
    return cartsModel.findByIdAndUpdate(cartID, cart, {
      new: true,
    });
  }
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
}
