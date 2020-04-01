const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/looger");
// Load route files
const bootcamps = require("./routes/bootcamps");

// Load env vars
dotenv.config({
  path: "./config/config.env"
});

const app = express();

//use logger middleware to log request
app.use(logger);

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} node on port ${PORT}`
  )
);
