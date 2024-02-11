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
    return cartsModel.findOne({ _id }).lean().populate("products");
  }

  static async updateCart(_id, modifiedCart) {
    return cartsModel.findByIdAndUpdate(_id, modifiedCart, {
      new: true,
    });
  }
  static async deleteCart(_id) {
    return cartsModel.findByIdAndDelete({ _id });
  }
}
