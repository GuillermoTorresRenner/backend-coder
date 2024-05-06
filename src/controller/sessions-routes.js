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

  //   const { email, password } = req.body;
  //   await UserServices.restorePasswordWithEmail(email, password);
  //   res.redirect("/login");
  // } catch (error) {
  //   Logger.error("Error:", error);
  //   res.status(500).send("Error interno del servidor");
  // }
});

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

router.get("/sessions/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});
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
        res.redirect("/products");
      }
    } catch (error) {
      Logger.error("Error:", error);
      res.status(500).send({ status: "error", message: "Invalid credentials" });
    }
  }
);
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

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserServices.getUserByID(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
export default router;
