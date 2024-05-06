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
});
const usersModel = mongoose.model("users", usersSchema);
export default usersModel;
