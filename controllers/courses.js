const Course = require("../models/Course");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const BootCamp = require("../models/Bootcamp");

/**
 * getCourses
 * * @desc    Get all courses list
 * * @route   GET /api/v1/courses
 * * @route   GET /api/v1/bootcamps/:bootcampId/courses
 * * @access  Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  let query;

  if (bootcampId) {
    query = Course.find({ bootcamp: bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * getCourse
 * * @desc    Get Single Course
 * * @route   GET /api/v1/courses/:id
 * * @access  Public
 * @param id
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course is found with id: ${id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

/*
 * createCourse
 ** @desc   Create Course
 ** @route   POST /api/v1/bootcamps/:bootcampId/courses
 ** @access  Private
 * @param bootcampId
 */

exports.createCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  req.body.bootcamp = bootcampId;
  // Check if bootcamp is exit with specific id
  const bootcamp = await BootCamp.findById(bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp is found with id: ${id}`, 404));
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * updateCourse
 * * @desc    Update Course
 * * @route   PUT /api/v1/courses/:id
 * * @access  Private
 * @param id
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course is found with id: ${id}`, 404));
  }
  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * deleteCourse
 * * @desc    Update Course
 * * @route   DELETE /api/v1/courses/:id
 * * @access  Private
 * @param id
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course is found with id: ${id}`, 404));
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
