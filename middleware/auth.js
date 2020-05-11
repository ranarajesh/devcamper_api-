const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  // Validate token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
