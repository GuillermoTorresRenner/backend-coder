//User errors

export class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = "User not found on DB";
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
