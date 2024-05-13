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
      res.status(201).send("prodcto creado");
    } catch (error) {
      if (error instanceof InsufficientDataError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else if (error instanceof ProductNotFoundError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else {
        res.status(500).send("Internal server error");
      }
    }
  }
);

router.put("/products/:pid", onlyAdminOrPremiumAccess, async (req, res) => {
  try {
    const { body } = req;
    const { pid } = req.params;
    const productOwner = await ProductsServices.getProductOwnerById(pid);
    /////////////
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
router.delete("/products/:pid", onlyAdminOrPremiumAccess, async (req, res) => {
  try {
    if (!pid) throw new InsufficientDataError("product", ["ProductID"]);
    const { pid } = req.params;
    const productOwner = await ProductsServices.getProductOwnerById(pid);

    if (req.usersRole === "PREMIUM" && req.usersEmail !== productOwner.owner) {
      throw new AuthorizationError();
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
      res.status(500).send("Internal server error");
    }
  }
});

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
