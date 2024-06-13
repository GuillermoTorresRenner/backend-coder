/**
 * definicion del modelo de la coleccion carts
 */

import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const cartsModel = mongoose.model("carts", cartSchema);
export default cartsModel;
