import { Router } from "express";
import ProductsDao from "../dao/productDao.js";
import multer from "multer";
import io from "../../app.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

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
  const { limit, ...unknownParams } = req.query;

  try {
    if (limit) {
      const data = await ProductsDao.getAllProductswhitLimits(limit);
      res.status(200).send(data);
    } else if (Object.keys(unknownParams).length > 0) {
      const unknownParam = Object.keys(unknownParams)[0];
      res.status(400).send(`Parámetro "${unknownParam}" es desconocido`);
    } else {
      const data = await ProductsDao.getAllProducts();
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
    const data = await ProductsDao.getProductByID(pid);
    res.status(200).send(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.post("/products", upload.single("img"), async (req, res) => {
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
  body.thumbnails = "images/products/" + file;

  try {
    await ProductsDao.createNewProduct(body);

    const newProductsList = await ProductsDao.getAllProducts();
    console.log(newProductsList);
    io.emit("res", newProductsList);
    // res.status(201).json(body);
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/products/:pid", async (req, res) => {
  const { body } = req;
  const { pid } = req.params;
  try {
    await ProductsDao.updateProduct(pid, body);
    res.status(200).send(body);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});
router.delete("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await ProductsDao.deleteProduct(pid);
    res.status(200).send("Articulo eliminado");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// router.get("/products", async (req, res) => {
//   const { limit, ...unknownParams } = req.query;

//   try {
//     if (limit) {
//       const data = await productManager.getProductWithLimit(limit);
//       res.status(200).send(data);
//     } else if (Object.keys(unknownParams).length > 0) {
//       const unknownParam = Object.keys(unknownParams)[0];
//       res.status(400).send(`Parámetro "${unknownParam}" es desconocido`);
//     } else {
//       const data = await productManager.getProducts();
//       res.status(200).send(data);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

// router.get("/products/:pid", async (req, res) => {
//   const { pid } = req.params;
//   try {
//     const data = await productManager.getProductById(pid);
//     res.status(200).send(data);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

// router.post("/products/", async (req, res) => {
//   const { body } = req;
//   try {
//     body.status = true;
//     await productManager.addProduct(body);
//     const newProductsList = await productManager.getProducts();
//     console.log(newProductsList);
//     io.emit("res", newProductsList);
//     res.status(201).json(body);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// router.put("/products/:pid", async (req, res) => {
//   const { body } = req;
//   const { pid } = req.params;
//   try {
//     productManager.updateProducts(pid, body);
//     res.status(200).send(body);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Error interno del servidor");
//   }
// });
// router.delete("/products/:pid", async (req, res) => {
//   const { pid } = req.params;
//   try {
//     productManager.deleteProducts(pid);
//     res.status(200).send("Articulo eliminado");
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Error interno del servidor");
//   }
// });

export default router;
