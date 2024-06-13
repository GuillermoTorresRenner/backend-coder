/**
 * definicion del modelo de la coleccion messages
 */

import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
});

const MessageModel = mongoose.model("messages", messageSchema);
export default MessageModel;
