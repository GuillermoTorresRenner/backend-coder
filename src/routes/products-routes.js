import { Router } from "express";
import productManager from "../model/ProductManager.js";
const router = Router();

router.get("/products", async (req, res) => {
  const { limit, ...unknownParams } = req.query;

  try {
    if (limit) {
      const data = await productManager.getProductWithLimit(limit);
      res.status(200).send(data);
    } else if (Object.keys(unknownParams).length > 0) {
      const unknownParam = Object.keys(unknownParams)[0];
      res.status(400).send(`Parámetro "${unknownParam}" es desconocido`);
    } else {
      const data = await productManager.getProducts();
      res.status(200).send(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const data = await productManager.getProductById(pid);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/products/", async (req, res) => {
  const { body } = req;
  try {
    body.status = true;
    await productManager.addProduct(body);
    res.status(201).send(body);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/products/:pid", async (req, res) => {
  const { body } = req;
  const { pid } = req.params;
  try {
    productManager.updateProducts(pid, body);
    res.status(200).send(body);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});
router.delete("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    productManager.deleteProducts(pid);
    res.status(200).send("Articulo eliminado");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
