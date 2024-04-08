import { UserServices } from "../repositories/Repositories.js";
export const onlyAdminAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);

    if (permission.role === "ADMIN") {
      next();
    } else {
      res.status(403).send("FORBIDDEN ACCESS");
    }
  } catch (error) {}
};
export const onlyUsersAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);
    if (permission.role === "USER") {
      next();
    } else {
      res.status(403).send("FORBIDDEN ACCESS");
    }
  } catch (error) {}
};
