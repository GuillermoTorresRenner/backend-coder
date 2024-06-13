/*
  Este archivo contendrá las rutas relacionadas con la autenticación de usuarios.
  Se encargará de manejar el registro, login y logout de usuarios.
  También se encargará de manejar el envío de emails para la recuperación de contraseñas.
  */

import { Router } from "express";
import { UserServices } from "../repositories/Repositories.js";
import passport from "passport";
import Logger from "../utils/Logger.js";
import NodeMailer from "../utils/NodeMailer.js";
import {
  AlreadyPasswordInUseError,
  InvalidLinkError,
  UserNotFoundError,
} from "../utils/CustomErrors.js";
import RestoreRepository from "../repositories/RestoreRepository.js";
const router = Router();

/*
  Esta función se encarga de registrar un nuevo usuario en la base de datos.
  Se utiliza el servicio de UserServices para crear un nuevo usuario.
  Si el usuario se crea correctamente, se redirige al usuario a la página de login.
  Si hay algún error, se muestra un mensaje de error.
  */
router.post(
  "/sessions/register",
  passport.authenticate("register", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      res.redirect("/login");
    } catch (error) {
      res.send("Error on Register process");
    }
  }
);

/*
  Esta función se encarga de enviar un email al usuario con un link para restablecer su contraseña.
  Se utiliza el servicio de UserServices para obtener el ID del usuario a partir del email.
  Si el usuario no existe, se muestra un mensaje de error.
  Si el usuario existe, se crea un nuevo registro en la colección "restores" con el ID del usuario.
  Se envía un email al usuario con un link que contiene el hash del registro creado.
  */
router.post("/sessions/restore", async (req, res) => {
  try {
    const { email } = req.body;
    const userId = await UserServices.getusersIdByEmail(email);
    if (!userId) throw UserNotFoundError();
    const restore = await RestoreRepository.createNewRestore(userId);
    const link = `http://${req.headers.host}/api/sessions/reset/${restore.hash}`;

    NodeMailer.sendMail({
      from: "Infuzion",
      to: email,
      subject: "password reset",
      html: `<h1>Click <a href="${link}" target="_blanc">HERE</a> to reset your INFUZION's password</h1>`,
    });
    res.redirect("/link-sended");
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
  Esta función se encarga de verificar si el hash recibido en la URL es válido.
  Si el hash no es válido, se muestra un mensaje de error.
  Si el hash es válido, se redirige al usuario a la página de restablecimiento de contraseña.
  */
router.get("/sessions/reset/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const restore = await RestoreRepository.getRestoreByHash(hash);
    if (!restore) {
      res.status(404).send("Invalid link");
    } else {
      const now = Date.now();
      const diff = now - restore.createdAt;
      if (diff > 1000 * 60 * 60) {
        res.redirect("/restore");
      } else {
        res.redirect(`/restore-password/${hash}`);
      }
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

/*
  Esta función se encarga de restablecer la contraseña del usuario.
  Se utiliza el servicio de UserServices para validar la nueva contraseña.
  Si la nueva contraseña es inválida, se muestra un mensaje de error.
  Si la nueva contraseña es válida, se actualiza la contraseña del usuario.
  Se elimina el registro de la colección "restores" asociado al hash recibido.
  Se redirige al usuario a la página de éxito.
  */
router.post("/sessions/new-password/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const { password } = req.body;

    const restore = await RestoreRepository.getRestoreByHash(hash);
    if (!restore) {
      throw InvalidLinkError();
    } else {
      const validateNewPassword = await UserServices.validateNewPassword(
        restore.user,
        password
      );
      if (!validateNewPassword) {
        throw new AlreadyPasswordInUseError();
      }
      await UserServices.restorePasswordWithID(restore.user, password);
      await RestoreRepository.deleteRestoreByHash(hash);
      res.redirect("/password-success");
    }
  } catch (error) {
    if (
      error instanceof InvalidLinkError ||
      error instanceof AlreadyPasswordInUseError
    ) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send("Internal server error");
    }
  }
});

/*
  Esta función se encarga de cerrar la sesión del usuario.
  Se destruye la sesión y se redirige al usuario a la página de inicio.
  */
router.get("/sessions/logout", (req, res) => {
  req.session.destroy((err) => {
    res.status(200).redirect("/");
  });
});

/*
  Esta función se encarga de iniciar la sesión del usuario.
  Se utiliza el servicio de UserServices para obtener el usuario a partir del email.
  Si el usuario no existe, se muestra un mensaje de error.
  Si el usuario existe, se redirige al usuario a la página de productos.
  */
router.post(
  "/sessions/login",
  passport.authenticate("login", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      if (!req.user) {
        res
          .status(500)
          .send({ status: "error", message: "Invalid credentials" });
      } else {
        req.session.userId = req.user._id;
        res.status(200).redirect("/products");
        //agregar función para alterar el lastconnection
        await UserServices.updateUserLastConnection(req.user._id);
      }
    } catch (error) {
      Logger.error("Error:", error);
      res.status(500).send({ status: "error", message: "Invalid credentials" });
    }
  }
);

/*
  Esta función se encarga de obtener el usuario actual.
  Se utiliza el ID del usuario almacenado en la sesión para obtener el usuario.
  Si no hay un usuario en sesión, se muestra un mensaje de error.
  Si hay un usuario en sesión, se muestra el usuario.
  */
router.get("/sessions/current", async (req, res) => {
  try {
    const userId = req.session.userId;

    if (userId) {
      const currentUser = await UserServices.getUserByID(userId);
      res.status(200).send(currentUser);
    } else {
      res.status(401).send({ message: "No active session" });
    }
  } catch (error) {
    // Manejo de errores
    Logger.error("Error:", error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
});

router.get(
  "/sessions/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/sessions/githubCallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect("/products");
  }
);

/*
  Esta función se encarga de obtener el usuario actual.
  Se utiliza el ID del usuario almacenado en la sesión para obtener el usuario.
  Si no hay un usuario en sesión, se muestra un mensaje de error.
  Si hay un usuario en sesión, se muestra el usuario.
  */
passport.serializeUser((user, done) => {
  if (user) {
    done(null, user._id);
  } else {
    done(new Error("User not found"), null);
  }
});

/*
  Esta función se encarga de obtener el usuario a partir de su ID.
  Se utiliza el servicio de UserServices para obtener el usuario a partir de su ID.
  Si el usuario no existe, se muestra un mensaje de error.
  Si el usuario existe, se muestra el usuario.
  */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserServices.getUserByID(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
export default router;
