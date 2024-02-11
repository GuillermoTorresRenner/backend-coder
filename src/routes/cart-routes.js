import { Router } from "express";
import cartManager from "../dao/CartManager.js";
const router = Router();

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const data = await cartManager.getCartById(cid);
    data
      ? res.status(200).send(data)
      : res.status(404).send("Carro no encontrado");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/carts", async (req, res) => {
  try {
    const newCartID = await cartManager.createNewCart();
    res.status(201).send(`Carro ${newCartID} creado`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post("/carts/:cid/product/:pid", async (req, res) => {
  const { quantity } = req.body;
  const { cid, pid } = req.params;
  try {
    await cartManager.addToCart(cid, pid, quantity);
    res.status(201).send("Items Agregado al carro");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
