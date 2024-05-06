import { Router } from "express";
import { UserServices } from "../repositories/Repositories.js";
const router = Router();
import auth from "../middlewares/auth.js";

router.put("/users/premium/:uid", auth, async (req, res) => {
  try {
    const { uid } = req.params;
    await UserServices.changeRole(uid);
    res.status(200).send("Role changed");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

export default router;
