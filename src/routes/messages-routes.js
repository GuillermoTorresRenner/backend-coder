import { Router } from "express";
import MessagesDao from "../dao/messagesDao.js";
import io from "../../app.js";
const router = Router();

router.post("/messages", async (req, res) => {
  const { body } = req;
  try {
    await MessagesDao.createNewMessage(body);
    const allMesagges = await MessagesDao.getAllMessages();
    io.emit("messages", allMesagges);
    // res.status(201).json(body);
    // res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
