//_______________________________________Generic errors_______________________________________________________________________

export class InsufficientDataError extends Error {
  constructor(entity, requiredData) {
    super();
    this.message = `Insufficient required data for ${entity}: ${requiredData.map(
      (d) => d
    )}`;
    this.statusCode = 400; // Change status code to 400 Bad Request
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    console.log("Error:", {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    });
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________User Errors_______________________________________________________________________

export class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = "User not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    console.log("Error:", {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    });
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Product Errors_______________________________________________________________________

export class ProductNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Product not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    console.log("Error:", {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    });
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Cart Errors_______________________________________________________________________

export class CartNotFoundError extends Error {
  constructor() {
    super();
    this.message = "Cart not found in the database";
    this.statusCode = 404;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    console.log("Error:", {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    });
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Authentication Errors_______________________________________________________________________

export class AuthenticationError extends Error {
  constructor() {
    super();
    this.message = "Authentication failed";
    this.statusCode = 401; // Unauthorized
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    console.log("Error:", {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    });
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

//_______________________________________Authorization Errors_______________________________________________________________________

export class AuthorizationError extends Error {
  constructor() {
    super();
    this.message = "You are not authorized to perform this action";
    this.statusCode = 403; // Forbidden
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
  getErrorData() {
    console.log("Error:", {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
    });
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
