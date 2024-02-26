import { Router } from "express";
import ProductsDao from "../dao/productDao.js";
import CartDao from "../dao/cartDao.js";

const router = Router();

router.get("/", async (req, res) => {
  res.redirect("/login");
});
router.get("/login", async (req, res) => {
  res.render("login");
});
router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/products", async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
  res.render("home", { data });
});
router.get("/product/:_id", async (req, res) => {
  const { _id } = req.params;
  const data = await ProductsDao.getProductByID(_id);
  res.render("product", { data });
});
router.get("/cart/:_id", async (req, res) => {
  const { _id } = req.params;
  const data = await CartDao.getCartByID(_id);
  console.log(data);
  res.render("cart", { data });
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
