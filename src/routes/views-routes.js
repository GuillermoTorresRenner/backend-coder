import { Router } from "express";
import ProductsDao from "../dao/productDao.js";
const router = Router();

router.get("/", async (req, res) => {
  res.redirect("/products");
});
router.get("/products", async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
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
