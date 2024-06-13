import mongoose from "mongoose";
const roles = ["USER", "ADMIN", "PREMIUM"];
const usersSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: roles,
    default: "USER",
  },
  documents: [
    {
      name: { type: String },
      reference: { type: String },
    },
  ],
  last_connection: { type: Date },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: "carts", default: null },
  oldCars: [
    {
      carId: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
      purchaseDate: { type: Date, default: Date.now() },
    },
  ],
});
const usersModel = mongoose.model("users", usersSchema);
export default usersModel;
