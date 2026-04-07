class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.success = false;
  }
}

module.exports = ApiError;