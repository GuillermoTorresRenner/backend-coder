import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const ticketsSchema = mongoose.Schema({
  code: { type: String, default: uuidv4(), unique: true },
  purchase_datetime: { type: Date, default: Date.now() },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});
const TicketsModel = mongoose.model("tickets", ticketsSchema);
export default TicketsModel;
24;
