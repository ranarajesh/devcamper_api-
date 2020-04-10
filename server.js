const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDb = require("./config/db");

// Load env vars
dotenv.config({
  path: "./config/config.env",
});

// Connect to MongodB server
connectDb();

// Load route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

// Body parser
app.use(express.json());

//use logger middleware to log request
app.use(morgan("dev"));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

//Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow
      .bold
  )
);

// Handle UnhandledPromiseRejection error
process.on("unhandledRejection", (err, promise) => {
  console.log(`1: Error: ${err.message}`.red);
  server.close(() => {
    process.exit(1);
  });
});
