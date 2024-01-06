const express = require("express");
const router = express.Router();
const pm = require("../model/ProductManager");
router.get("/products", async (req, res) => {
  const { limit, ...unknownParams } = req.query;

  try {
    if (limit) {
      const data = await pm.getProductWithLimit(limit);
      res.send(data);
    } else if (Object.keys(unknownParams).length > 0) {
      const unknownParam = Object.keys(unknownParams)[0];
      res.status(400).send(`Parámetro "${unknownParam}" es desconocido`);
    } else {
      const data = await pm.getProducts();
      res.send(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const data = await pm.getProductById(pid);
    res.send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
