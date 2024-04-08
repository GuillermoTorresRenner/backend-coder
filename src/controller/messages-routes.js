import { Router } from "express";
import { MessagesServices } from "../repositories/Repositories.js";
import io from "../../app.js";
import { onlyUsersAccess } from "../middlewares/permissions.js";
const router = Router();

router.post("/messages", onlyUsersAccess, async (req, res) => {
  const { body } = req;
  try {
    await MessagesServices.createNewMessage(body);
    const allMesagges = await MessagesServices.getAllMessages();
    io.emit("messages", allMesagges);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;