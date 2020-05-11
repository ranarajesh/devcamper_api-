const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDb = require('./config/db');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

// Connect to MongodB server
connectDb();

// Load route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Fileupload middleware
app.use(fileupload());

//use logger middleware to log request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

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
process.on('unhandledRejection', (err, promise) => {
  console.log(`1: Error: ${err.message}`.red);
  server.close(() => {
    process.exit(1);
  });
});
