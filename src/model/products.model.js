/**
 * definicion del modelo de la coleccion products  con el agregado del plugin de paginacion mongoose-paginate-v2
 */

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: [{ type: String }],
  owner: { type: String, default: "ADMIN" },
});
productSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model("products", productSchema);
export default productsModel;
