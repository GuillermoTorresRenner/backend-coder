/*
  Este archivo contiene las rutas de la API que tienen que ver con los usuarios.
  Utiliza Express para definir las rutas y Multer para el manejo de archivos.
  También utiliza los servicios de UserServices para interactuar con la base de datos de usuarios.
  Las rutas incluyen operaciones como obtener todos los usuarios, obtener un usuario por su ID, actualizar un usuario y eliminar un usuario.
  También incluye rutas para subir documentos y cambiar el rol de un usuario.
  */

import { Router } from "express";
import { UserServices } from "../repositories/Repositories.js";
const router = Router();
import auth from "../middlewares/auth.js";
import multer from "multer";
import path from "path";
import { UserNotFoundError } from "../utils/CustomErrors.js";
import { onlyAdminAccess } from "../middlewares/permissions.js";

//-------------------------------multer config--------------------------------

//Configuración del storage para guardar los archivos
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const { uid } = req.params;
    const filename = `${file.fieldname}-${uid}-${file.originalname}`; // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    cb(null, filename);
  },
  destination: function (req, file, cb) {
    let path = "";
    if (file.fieldname === "profile") {
      path = "public/profiles";
    } else if (file.fieldname === "product") {
      path = "public/products";
    } else if (
      file.fieldname === "identification" ||
      file.fieldname === "address" ||
      file.fieldname === "account"
    ) {
      path = "public/documents";
    }
    cb(null, path);
  },
});

//Configuración de las opciones para realizar el upload
const upload = multer({
  storage,
  limits: { fileSize: 3000000 },
  fileFilter: (req, file, cb) => {
    if (
      file.fieldname === "identification" ||
      file.fieldname === "address" ||
      file.fieldname === "account"
    ) {
      const fileTypes = /pdf|docx|doc|txt/;
      const mimetype = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));
      if (mimetype === extname) {
        return cb(null, true);
      }
      cb("El archivo debe ser un documento válido: pdf|docx|doc|txt");
    } else {
      const fileTypes = /jpg|jpeg|png|bmp|gif|webp/;
      const mimetype = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname));
      if (mimetype === extname) {
        return cb(null, true);
      }
      cb("El archivo debe ser una imágen válida: jpg|jpeg|png|bmp|gif");
    }
  },
}).fields([
  { name: "profile" },
  { name: "product" },
  { name: "identification" },
  { name: "address" },
  { name: "account" },
]);

//-------------------------------routes--------------------------------

/**
 * Esta función se encarga de subir documentos requeridos para poder cambiar el rol a premium
 */
router.post(
  "/users/:uid/documents",
  auth,
  upload,

  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await UserServices.getUserByID(uid);
      if (!user) throw new UserNotFoundError();
      const { identification, address, account } = req.files;
      if (identification) {
        await UserServices.addDocument(uid, {
          name: "identification",
          reference: identification[0].path.replace("public/", ""),
        });
      }
      if (address) {
        await UserServices.addDocument(uid, {
          name: "address",
          reference: address[0].path.replace("public/", ""),
        });
      }
      if (account) {
        await UserServices.addDocument(uid, {
          name: "account",
          reference: account[0].path.replace("public/", ""),
        });
      }

      res.status(200).send("Documentos subidos con éxito.");
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(error.statusCode).send(error.getErrorData());
      } else {
        res.status(500).send("Error interno del servidor");
      }
    }
  }
);

/**
 *Esta función se encarga de actualziar los dosucmentos subidos por el usuario para cambiar su rol a premium
 */
router.put("/users/premium/:uid", auth, async (req, res) => {
  try {
    const { uid } = req.params;
    const userRole = await UserServices.getRoleByID(uid);
    const documents = await UserServices.getUsersDocumentsById(uid);
    if (!documents)
      res.status(404).send("this user don't a have the required documents");
    const hasIdentification = documents.documents.some(
      (doc) => doc.name === "identification"
    );
    const hasAddress = documents.documents.some(
      (doc) => doc.name === "address"
    );
    const hasAccount = documents.documents.some(
      (doc) => doc.name === "account"
    );
    if (
      userRole.role === "USER" &&
      hasAccount &&
      hasAddress &&
      hasIdentification
    ) {
      res.status(200).send("Role changed");
      await UserServices.changeRole(uid);
    } else {
      res.status(400).send("User doesn't have all the required documents");
    }
  } catch (error) {
    res
      .status(500)
      .send({ text: "Internal server error", error: error.message });
  }
});

/**
 * Esta función se encarga de obtener todos los usuarios para poder administrarlos posteriormente desde el formulario de administración.
 */
router.get("/users", auth, onlyAdminAccess, async (req, res) => {
  try {
    const users = await UserServices.getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/**
 * Esta función se encarga de eliminar las cuentas inactivas de la base de datos.
 */
router.delete("/users", auth, onlyAdminAccess, async (req, res) => {
  try {
    const users = await UserServices.deleteInactiveAccounts();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/**
 * Esta función se encarga de obtener un usuario por su email.
 */
router.get("/users/:email", auth, onlyAdminAccess, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserServices.getUserByEmail(email);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/**
 * Esta función se encarga de eliminar un usuario por su email.
 */
router.delete("/users/:email", auth, onlyAdminAccess, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserServices.deleteUserByEmail(email);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/**
 * Esta función se encarga de actualizar el rol de un usuario por su email.
 */
router.put("/users", auth, onlyAdminAccess, async (req, res) => {
  try {
    const { email, newRole } = req.query;
    const user = await UserServices.updateRoleByEmail(email, newRole);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

export default router;
