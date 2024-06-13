import { UserServices } from "../repositories/Repositories.js";
import { AuthorizationError } from "../utils/CustomErrors.js";

// Middleware para permitir acceso solo a usuarios con rol de ADMIN.
export const onlyAdminAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);

    if (permission.role === "ADMIN") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
};

// Middleware para permitir acceso solo a usuarios con rol de USER.
export const onlyUsersAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);
    if (permission.role === "USER") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
};

// Middleware para permitir acceso solo a usuarios con rol de PREMIUM.
export const onlyPremiumAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);
    if (permission.role === "PREMIUM") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
};

// Middleware para permitir acceso a usuarios con rol de ADMIN o PREMIUM.
export const onlyAdminOrPremiumAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);
    const email = await UserServices.getusersEmailById(req.session.userId);

    req.usersRole = permission.role; // Almacena el rol del usuario en el objeto de solicitud
    req.usersEmail = email.email;
    if (permission.role === "ADMIN" || permission.role === "PREMIUM") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
};

// Middleware para permitir acceso a usuarios con rol de USER o PREMIUM.
export const onlyPremiumOrUserAccess = async (req, res, next) => {
  try {
    const permission = await UserServices.getRoleByID(req.session.userId);
    const email = await UserServices.getusersEmailById(req.session.userId);

    req.usersRole = permission.role; // Almacena el rol del usuario en el objeto de solicitud
    req.usersEmail = email.email;
    if (permission.role === "USER" || permission.role === "PREMIUM") {
      next();
    } else {
      throw new AuthorizationError();
    }
  } catch (error) {
    if (error instanceof AuthorizationError) {
      res.status(error.statusCode).send(error.getErrorData());
    } else {
      res.status(500).send(error);
    }
  }
};
