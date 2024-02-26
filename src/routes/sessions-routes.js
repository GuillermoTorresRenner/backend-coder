import { Router } from "express";
import UsersDao from "../dao/usersDao.js";
import bcrypt from "bcrypt";
const router = Router();

router.post("/sessions/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    await UsersDao.register(first_name, last_name, email, age, password);

    res.redirect("/login");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});
router.post("/sessions/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersDao.getUserByEmail(email);
    if (user) {
      const login = bcrypt.compareSync(password, user.password);
      if (login) {
        ///////////////////////////PROBLEMA//////////////////////////////////////////
        req.session.saludo = "hola";
        res.redirect("/products");
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error.message);
  }
});

export default router;
