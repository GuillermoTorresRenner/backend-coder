import Logger from "./Logger.js";

// Error para cuando no se proporcionan suficientes datos para una operación
export class InsufficientDataError extends Error {
  constructor(entity, requiredData) {
    super();
    this.message = `Insufficient required data for ${entity}: ${requiredData.map(
      (d) => d
    )}`;
    this.statusCode = 400;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando un usuario no se encuentra en la base de datos
export class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = "User not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando un enlace de restablecimiento de contraseña es inválido
export class InvalidLinkError extends Error {
  constructor() {
    super();
    this.message = "Invalid link";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando se intenta usar una contraseña ya en uso
export class AlreadyPasswordInUseError extends Error {
  constructor() {
    super();
    this.message = "Password is already in use, please choose another one";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando un producto no se encuentra disponible en la base de datos
export class ProductNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Product not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando un carrito de compras no se encuentra en la base de datos
export class CartNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Cart not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.warning(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando no se puede crear un carrito de compras
export class CartNotCreatedError extends Error {
  constructor() {
    super();
    this.message = "The cart could not be created";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando no se puede eliminar un producto del carrito
export class ProductCartNotDeletedError extends Error {
  constructor() {
    super();
    this.message = "The product was not deleted from cart";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando no se puede actualizar un carrito de compras
export class CartNotUpdatedError extends Error {
  constructor() {
    super();
    this.message = "The cart was not updated";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando no se puede realizar la compra de un carrito
export class CartNotBuyError extends Error {
  constructor() {
    super();
    this.message = "The cart was not buy it";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando no se puede crear un ticket de compra
export class TicketNotCreatedError extends Error {
  constructor() {
    super();
    this.message = "The ticket was not created";
    this.statusCode = 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando falla la autenticación de un usuario
export class AuthenticationError extends Error {
  constructor() {
    super();
    this.message = "Authentication failed";
    this.statusCode = 401;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

// Error para cuando un usuario no tiene autorización para realizar una acción
export class AuthorizationError extends Error {
  constructor() {
    super();
    this.message = "You are not authorized to perform this action";
    this.statusCode = 403; // Forbidden
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    Logger.error(
      `${new Date().toLocaleDateString()} - Error Type: ${
        this.name
      } - Status: ${this.statusCode} - Mesage${this.message}`
    );
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
