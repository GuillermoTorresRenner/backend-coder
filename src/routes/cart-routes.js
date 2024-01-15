const express = require("express");
const router = express.Router();
const cartManager = require("../model/CartManager");
/*Hola Guille ya revise tu trabajo tengo unas observaciones para mejorarla:

    ---------------------------------------en la rutas POST api/carts se debe crear una carrito con el array de productos vació
    ---------------------------------------al agregar un producto sin enviar la quantity por body se debe crear con el valor 1
    al seguir agregando el mismo producto al carro si no envió nada en quantity también debe sumarse 1

esas son mis observaciones, si tienes alguna duda me escribes  */

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

module.exports = router;
