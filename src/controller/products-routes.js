/**
 * Este archivo contiene las rutas y controladores relacionados con los productos.
 * Utiliza Express para definir las rutas y Multer para el manejo de archivos.
 * También utiliza los servicios de ProductsServices y MockingProductsServices para interactuar con la base de datos de productos.
 * Las rutas incluyen operaciones como obtener todos los productos, obtener un producto por su ID, crear un nuevo producto, actualizar un producto y eliminar un producto.
 * También incluye una ruta para obtener productos falsos para pruebas.
 */
/**
 *
 */
import { Router } from "express";
import {
  MockingProductsServices,
  ProductsServices,
} from "../repositories/Repositories.js";
import multer from "multer";
import io from "../../app.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import {
  onlyAdminAccess,
  onlyAdminOrPremiumAccess,
} from "../middlewares/permissions.js";
import {
  InsufficientDataError,
  ProductNotFoundError,
  AuthorizationError,
} from "../utils/CustomErrors.js";
import NodeMailer from "../utils/NodeMailer.js";

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

/**
 * Esta función se encarga de obtener todos los productos de la base de datos permitiendo el fintrado de los mismos mediante los query params
query: string que se utiliza para buscar productos por su título o descripción.
limit: número de productos a mostrar por página.
page: número de página a mostrar.
sort: string que se utiliza para ordenar los productos por precio o fecha de creación.
 *  */
router.get("/products", async (req, res) => {
  const { query, limit, page, sort } = req.query;

  try {
    const data = await ProductsServices.getAllProducts(
      query,
      page,
      limit,
      sort
    );
    if (!data) throw ProductNotFoundError();
    res.status(200).send(data);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/**
 * Esta función se encarga de obtener un producto por su ID.
 *  */
router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);
    const data = await ProductsServices.getProductByID(pid);
    if (!data) throw new ProductNotFoundError();

    res.status(200).send(data);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(404).send("Internal server error");
    }
  }
});

/**
 * Esta función se encarga de crear un nuevo producto en la base de datos.
 * Solo los usuarios con rol "ADMIN" o "PREMIUM" pueden crear productos.
 * Los productos creados por usuarios "PREMIUM" se asocian a su correo electrónico.
 * */
router.post(
  "/products",
  upload.single("img"),
  onlyAdminOrPremiumAccess,
  async (req, res) => {
    try {
      const { body } = req;
      const { title, description, price, code, stock, category } = body;
      const userRole = req.usersRole;
      const userMail = req.usersEmail;

      const file = req.file.filename;
      if (
        !title ||
        !description ||
        !price ||
        !code ||
        !stock ||
        !category ||
        !file
      )
        throw InsufficientDataError("product", [
          "title",
          "description",
          "price",
          "code",
          "stock",
          "category",
          "product img",
        ]);

      body.thumbnails = "images/products/" + file.trim();
      userRole === "PREMIUM" ? (body.owner = userMail) : (body.owner = "ADMIN");

      await ProductsServices.createNewProduct(body);

      const newProductsList = await ProductsServices.getAllProducts();
      if (!newProductsList) throw new ProductNotFoundError();
      io.emit("res", newProductsList);
      res.render("successCreation");
    } catch (error) {
      if (error instanceof InsufficientDataError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else {
        res.status(500).send(error.message);
      }
    }
  }
);

/**
 * Esta función se encarga de actualizar un producto en la base de datos.
 * Solo los usuarios con rol "ADMIN" o "PREMIUM" pueden actualizar productos.
 * Los productos solo pueden ser actualizados por su propietario.
 * */
router.put("/products/:pid", onlyAdminOrPremiumAccess, async (req, res) => {
  try {
    const { body } = req;
    const { pid } = req.params;
    const productOwner = await ProductsServices.getProductOwnerById(pid);
    const { title, description, price, code, stock, category } = body;
    if (
      !pid ||
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !category
    )
      throw InsufficientDataError("product", [
        "ProductID",
        "title",
        "description",
        "price",
        "code",
        "stock",
        "category",
      ]);
    if (req.usersRole === "PREMIUM" && req.usersEmail !== productOwner.owner) {
      throw new AuthorizationError();
    }
    await ProductsServices.updateProduct(pid, body);
    res.status(200).send(body);
  } catch (error) {
    if (
      error instanceof InsufficientDataError ||
      error instanceof AuthorizationError
    ) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/**
 * Esta función se encarga de eliminar un producto de la base de datos.
 * Solo los usuarios con rol "ADMIN" o "PREMIUM" pueden eliminar productos.
 * Los productos solo pueden ser eliminados por su propietario salvo para Admin que puede eliminar cualquier producto.
 * */
router.delete("/products/:pid", onlyAdminOrPremiumAccess, async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);
    const productOwner = await ProductsServices.getProductOwnerById(pid);
    const product = await ProductsServices.getProductByID(pid);
    if (req.usersRole === "PREMIUM" && req.usersEmail !== productOwner.owner) {
      throw new AuthorizationError();
    }
    //agregar funcionalidades para avisar a premium que un producto ha sido eliminado
    if (req.usersRole === "PREMIUM") {
      NodeMailer.sendMail({
        from: "Infuzuion",
        to: productOwner.owner,
        subject: "Producto eliminado",
        text: `El producto "${product.title.toUpperCase()}" ha sido eliminado de la base de datos de Infuzuion.`,
      });
    }
    await ProductsServices.deleteProduct(pid);
    res.status(200).send("Articulo eliminado");
  } catch (error) {
    if (
      error instanceof InsufficientDataError ||
      error instanceof AuthorizationError
    ) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

/**
 * Esta función se encarga de obtener productos falsos para pruebas mediante el uso de MockingProductsServices.
 * */
router.get("/mockingproducts", async (req, res) => {
  try {
    const fakeProducts = MockingProductsServices.getProducts();
    if (!fakeProducts) throw ProductNotFoundError();
    res.status(200).send(fakeProducts);
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

export default router;
