import productsModel from "./model/products.model.js";
export default class ProductsDao {
  static async createNewProduct(newProduct) {
    return productsModel.create(newProduct);
  }
  static async getAllProducts() {
    return productsModel.find().lean();
  }
  static async getProductByID(_id) {
    return productsModel.findOne({ _id }).lean();
  }
  static async getAllProductswhitLimits(limit) {
    return productsModel.find().limit(limit).lean();
  }
  static async updateProduct(_id, modifiedProduct) {
    return productsModel.findByIdAndUpdate(_id, modifiedProduct, {
      new: true,
    });
  }
  static async deleteProduct(_id) {
    return productsModel.findByIdAndDelete({ _id });
  }
}
