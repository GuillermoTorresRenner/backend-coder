import { Router } from "express";
import ProductManager from "../model/ProductManager.js";
const router = Router();

router.get("/", async (req, res) => {
  const data = await ProductManager.getProducts();
  res.render("home", { data });
});

//Ruta para el socket
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default router;
