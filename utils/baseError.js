class BaseError extends Error {
  constructor(name, statusCode, description, isOperational = true) {
    super(description);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BaseError;
