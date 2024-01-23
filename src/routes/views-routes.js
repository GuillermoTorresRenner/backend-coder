import { Router } from "express";
const router = Router();
const obj = {
  name: "Guille",
  message: "Este es un mensaje de prueba",
};
const data = {
  obj,
};

router.get("/", (req, res) => {
  res.render("home", data);
});

export default router;
