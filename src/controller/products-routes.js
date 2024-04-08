import { Router } from "express";
import { ProductsServices } from "../repositories/Repositories.js";
import multer from "multer";
import io from "../../app.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { onlyAdminAccess } from "../middlewares/permissions.js";

const router = Router();

////////////////////////MULTER CONFIG///////////////////////////////////////////////
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const filename = uuidv4() + file.originalname; // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    cb(null, filename);
  },
  destination: "public/images/products",
});
const upload = multer({
  dest: "src/public",
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|jpeg|png|bmp|gif|webp/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimetype === extname) {
      return cb(null, true);
    }
    cb("El archivo debe ser una imágen válida: jpg|jpeg|png|bmp|gif");
  },
});

///////////////////////ROUTES//////////////////////////////////////////////////

router.get("/products", async (req, res) => {
  const { query, limit, page, sort } = req.query;

  try {
    const data = await ProductsServices.getAllProducts(
      query,
      page,
      limit,
      sort
    );
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const data = await ProductsServices.getProductByID(pid);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post(
  "/products",
  upload.single("img"),
  onlyAdminAccess,
  async (req, res) => {
    const { body } = req;
    !body.title && res.send("El título es requerido");
    !body.description && res.send("La descripción es requerida");
    !body.price && res.send("El precio es requerido");
    !body.code && res.send("El código es requerido");
    !body.stock && res.send("El stock es requerido");
    !body.category && res.send("La categoría es requerida");
    const file = req.file.filename;
    console.log("NOMBRE DE ARCHIVO", req.file.filename);
    !file && res.send("Imagen de producto requerida");
    body.thumbnails = "images/products/" + file.trim();

    try {
      await ProductsServices.createNewProduct(body);

      const newProductsList = await ProductsServices.getAllProducts();
      console.log(newProductsList);
      io.emit("res", newProductsList);
      // res.status(201).json(body);
      res.redirect("/");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.put("/products/:pid", onlyAdminAccess, async (req, res) => {
  const { body } = req;
  const { pid } = req.params;
  try {
    await ProductsServices.updateProduct(pid, body);
    res.status(200).send(body);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});
router.delete("/products/:pid", onlyAdminAccess, async (req, res) => {
  const { pid } = req.params;
  try {
    await ProductsServices.deleteProduct(pid);
    res.status(200).send("Articulo eliminado");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
