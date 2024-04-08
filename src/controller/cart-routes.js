import { Router } from "express";
import { CartServices } from "../repositories/Repositories.js";
const router = Router();

router.get("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const data = await CartServices.getCartByID(cid);
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
    const newCartID = await CartServices.createNewcart();
    res.status(201).send(`Carro ${newCartID} creado`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.post("/carts/:cid/products/:pid", async (req, res) => {
  const { quantity } = req.body;
  const { cid, pid } = req.params;
  try {
    const data = await CartServices.addToCart(cid, pid, quantity);
    res.status(201).send(data);
    console.log(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete("/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const data = await CartServices.deleteCartProductByID(cid, pid);
    res.send(data);
  } catch (error) {
    res.send(error.message);
  }
});
router.delete("/carts/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    await CartServices.deleteCartByID(cid);
    res.send(`cart ${cid} was deleted successfully`);
  } catch (error) {
    res.send(error.message);
  }
});
router.put("/carts/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    const { cid } = req.params;

    if (!Array.isArray(products)) {
      return res.status(400).send({
        error:
          "El cuerpo de la solicitud debe contener un array de objetos de productos.",
      });
    }

    const updatedCart = await CartServices.updateCartByID(cid, products);

    res.send(updatedCart);
  } catch (error) {
    res.status(500).send({ error: "Internal server error." });
  }
});

router.put("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await CartServices.updateCartProductsByID(
      cid,
      pid,
      quantity
    );
    res.send(updatedCart);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Internal server error.", description: error.message });
  }
});

export default router;
