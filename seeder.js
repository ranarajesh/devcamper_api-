const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// Connect to DB
connectDb();
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// Import data in DB
const importInDB = async () => {
  try {
    await Bootcamp.create(bootcamps);
    //await Course.create(courses);
    console.log("Data imported to dB".green.inverse);
    process.exit(1);
  } catch (e) {
    console.error(e);
  }
};

// Delete bulk data from DB
const deleteFromDB = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data deleted from DB".red.inverse);
    process.exit(1);
  } catch (e) {
    console.error(e);
  }
};

if (process.argv[2] === "-insert") {
  importInDB();
} else if (process.argv[2] === "-delete") {
  deleteFromDB();
}
