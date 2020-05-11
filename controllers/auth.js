const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asynchHandler = require("../middleware/asyncHandler");

/**
 * register
 * * @desc    Register new user
 * * @route   POST /api/v1/auth/register
 * * @access  Public
 *  @params name, email, password, role
 */
exports.register = asynchHandler(async (req, res, next) => {
  const { email, password, name, role } = req.body;

  // Create new user
  const user = await User.create({ email, password, name, role });
  // Send token response
  sendTokenResponse(user, 200, res);
});

/**
 * login
 * * @desc    login with user credentials
 * * @route   POST /api/v1/auth/login
 * * @access  Public
 *  @params email, password
 */
exports.login = asynchHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(
      new ErrorResponse("Please enter valid email and password", 400)
    );
  }

  // Check user in dB
  const user = await User.findOne({ email }).select("+password");

  //Check valid user or found
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //Check for password match
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

/**
 * me
 * * @desc    find loggedin user details
 * * @route   GET /api/v1/auth/me
 * * @access  Private
 */
exports.getMe = asynchHandler(async (req, res, next) => {
  const { id } = req.user;

  //Get user details
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSignedJWTToken();
  const options = {};
  const jwtCookieExpireIn = process.env.JWT_COOKIE_EXPIRE;
  options.expires = new Date(
    Date.now() + jwtCookieExpireIn * 24 * 60 * 60 * 1000
  );
  options.httpOnly = true;

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
