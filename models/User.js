const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxlength: [50, "Name should not be more than 50 Character"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Match Password
UserSchema.methods.matchPassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

//Sign JWT Token creation
UserSchema.methods.getSignedJWTToken = function () {
  const jwtPayload = { id: this._id };
  const jwtSecret = process.env.JWT_TOKEN_SECRET;
  const jwtExpireIn = process.env.JWT_TOKEN_EXPIRE;
  return jwt.sign(jwtPayload, jwtSecret, {
    expiresIn: jwtExpireIn,
  });
};

// Hashed password before store to DB
UserSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});
module.exports = mongoose.model("User", UserSchema);
