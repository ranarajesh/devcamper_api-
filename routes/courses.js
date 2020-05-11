const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const router = express.Router({ mergeParams: true });

const advanceResults = require("../middleware/advanceResults");
const Course = require("../models/Course");

router
  .route("/")
  .get(
    advanceResults(Course, { path: "bootcamp", select: "name description" }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
