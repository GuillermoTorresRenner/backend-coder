import { Router } from "express";
import UsersDao from "../dao/usersDao.js";
import passport from "passport";
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
    const { email, password } = req.body;
    await UsersDao.restorePasswordWithEmail(email, password);
    res.redirect("/login");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error interno del servidor");
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
      console.log("user", req.user);
      if (!req.user) {
        res
          .status(500)
          .send({ status: "error", message: "Invalid credentials" });
      } else {
        req.session.userId = req.user._id;
        res.redirect("/products");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ status: "error", message: "Invalid credentials" });
    }
  }
);

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

export default router;
