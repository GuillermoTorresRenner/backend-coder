import { Router } from "express";
import ProductsDao from "../dao/productDao.js";
import UsersDao from "../dao/usersDao.js";
import auth from "../middlewares/auth.js";
import {
  onlyAdminAccess,
  onlyAdminOrPremiumAccess,
  onlyPremiumAccess,
  onlyPremiumOrUserAccess,
} from "../middlewares/permissions.js";
import {
  CartServices,
  ProductsServices,
  UserServices,
} from "../repositories/Repositories.js";

const router = Router();

// Redirecciona a la página de login
router.get("/", async (req, res) => {
  res.redirect("/login");
});

// Muestra la página de login
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

// Muestra la página de registro
router.get("/register", async (req, res) => {
  res.render("register");
});

// Muestra la página de perfil del usuario
router.get("/profile", async (req, res) => {
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);
  res.render("profile", { userData });
});

// Muestra la página de productos
router.get("/products", auth, async (req, res) => {
  const { query, limit, page, sort } = req.query;
  const data = await ProductsDao.getAllProducts(query, page, limit, sort);
  const { userId } = req.session;
  const userData = await UsersDao.getUserByID(userId);

  res.render("home", { data, userData });
});

// Muestra la página de detalle de un producto específico
router.get("/product/:_id", auth, async (req, res) => {
  const { _id } = req.params;
  const data = await ProductsDao.getProductByID(_id);
  res.render("product", { data });
});

// Muestra la página del carrito de compras del usuario
router.get("/my-cart", auth, async (req, res) => {
  const uid = req.session.userId;
  const cid = await UserServices.getCartIDByUserID(uid);
  const data = await CartServices.getCartByID(cid);
  if (!data) {
    return res.render("cart", { data: { products: [] }, totalPrice: 0 });
  } else {
    data.products.map((pro) => {
      pro.total = pro.productId.price * pro.quantity;
    });
    const totalPrice = data.products.reduce(
      (acc, product) => acc + product.total,
      0
    );
    res.render("cart", { data, totalPrice });
  }
});

// Muestra la página de productos en tiempo real
router.get("/realtimeproducts", auth, (req, res) => {
  res.render("realTimeProducts");
});

// Muestra la página para agregar un nuevo producto
router.get("/new-product", auth, (req, res) => {
  res.render("newProduct");
});

// Muestra la página de chat
router.get("/chat", auth, (req, res) => {
  res.render("chat");
});

// Muestra la página para generar correo de recuperación
router.get("/restore", (req, res) => {
  res.render("restore");
});

// Muestra la página para restaurar contraseña mediante un hash
router.get("/restore-password/:hash", (req, res) => {
  const { hash } = req.params;
  res.render("restorePassword", { hash });
});

// Muestra la página de confirmación de envío de enlace de recuperación
router.get("/link-sended", (req, res) => {
  res.render("linkSended");
});

// Muestra la página de confirmación de cambio de contraseña
router.get("/password-success", (req, res) => {
  res.render("passwordChanges");
});

// Muestra el dashboard de gestión de usuarios para administradores
router.get("/dashboard", auth, onlyAdminAccess, async (req, res) => {
  res.render("dashboard");
});

// Muestra la página de productos administrados por el usuario
router.get(
  "/products-admin",
  auth,
  onlyAdminOrPremiumAccess,
  async (req, res) => {
    try {
      const { userId } = req.session;
      const usersRole = await UserServices.getRoleByID(userId);
      let products = {};
      if (usersRole.role === "ADMIN") {
        products = await ProductsServices.getAllProducts();
      } else {
        products = await ProductsServices.getOwnersProductsById(userId);
      }
      res.render("productsAdmin", { products });
    } catch (error) {}
  }
);

// Muestra la página para actualizar un producto
router.get(
  "update-product/:id",
  auth,
  onlyAdminOrPremiumAccess,
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await ProductsServices.getProductByID(id);

      res.render("editProduct", { product });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Muestra la página de pagos
router.get("/payments", auth, onlyPremiumOrUserAccess, async (req, res) => {
  try {
    const uid = req.session.userId;
    const cid = await UserServices.getCartIDByUserID(uid);
    const data = await CartServices.getCartByID(cid);
    data.products.map((pro) => {
      pro.total = pro.productId.price * pro.quantity;
    });
    const total = data.products.reduce(
      (acc, product) => acc + product.total,
      0
    );
    res.render("payments", { total });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// Muestra la página de detalle de compra
router.get(
  "/purchase-detail",
  auth,
  onlyPremiumOrUserAccess,
  async (req, res) => {
    try {
      res.render("purchaseDetail");
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);
export default router;
