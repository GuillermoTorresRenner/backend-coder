import { Router } from "express";
import ProductsDao from "../dao/productDao.js";
const router = Router();

router.get("/", async (req, res) => {
  const data = await ProductsDao.getAllProducts();
  res.render("home", { data });
});

//Ruta para el socket
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});
//Ruta para ingresar productos
router.get("/admin", (req, res) => {
  res.render("admin");
});
//Ruta para chat
router.get("/chat", (req, res) => {
  res.render("chat");
});

export default router;
