import productsModel from "../model/products.model.js";
export default class ProductsDao {
  static async createNewProduct(newProduct) {
    return productsModel.create(newProduct);
  }
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
