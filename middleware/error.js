const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // Mongoose Cast to bad ObjectId
  if (error.name === "CastError") {
    const message = `Resource Not Found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate objectId
  if (error.code === 11000) {
    const message = `Duplicate Field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Duplicate objectId
  if (error.name === "ValidatorError") {
    message = Object.values(error.errors).map((e) => e.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error!!!",
  });
};

module.exports = errorHandler;
