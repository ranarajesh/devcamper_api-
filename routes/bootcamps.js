const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const router = express.Router();

const advanceResults = require("../middleware/advanceResults");
const Bootcamp = require("../models/Bootcamp");

//Include resource router
const courseRouter = require("./courses");

// Re-route for getting courses
router.use("/:bootcampId/courses", courseRouter);

router.route("/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advanceResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

module.exports = router;
