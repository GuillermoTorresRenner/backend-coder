import { Router } from "express";
import ProductsDao from "../dao/productDao.js";
import CartDao from "../dao/cartDao.js";
import UsersDao from "../dao/usersDao.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  res.redirect("/login");
});
router.get("/login", async (req, res) => {
  try {
    const { userId } = req.session;
    if (userId) {
      res.redirect("/products");
    } else {
      res.render("login");
    }
  } catch (error) {
    res.send("Error interno en el servidor");
  }
});
router.get("/register", async (req, res) => {
  res.render("register");
});
router.get("/profile", async (req, res) => {
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);
  res.render("profile", { userData });
});

router.get("/products", auth, async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);

  res.render("home", { data, userData });
});
router.get("/product/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  const data = await ProductsDao.getProductByID(_id);
  res.render("product", { data });
});
router.get("/cart/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  const data = await CartDao.getCartByID(_id);
  res.render("cart", { data });
});

//Ruta para el socket
router.get("/realtimeproducts", auth, (req, res) => {
  res.render("realTimeProducts");
});
//Ruta para ingresar productos
router.get("/admin", auth, (req, res) => {
  res.render("admin");
});
//Ruta para chat
router.get("/chat", auth, (req, res) => {
  res.render("chat");
});
//rgenerar correo de recuperación
router.get("/restore", (req, res) => {
  res.render("restore");
});
//confimar correo de recuperación enviado
router.get("/link-sended", (req, res) => {
  res.render("linkSended");
});

export default router;
