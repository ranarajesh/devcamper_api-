const Course = require("../models/Course");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { checkForOwner } = require("../utils/controllers");
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

  if (bootcampId) {
    const courses = await Course.find({ bootcamp: bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    const courses = await res.advanceResults.advanceQuery;

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
      pagination: res.advanceResults.pagination,
    });
  }
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
  const userId = req.user.id;
  const { user } = req;
  req.body.user = userId;
  req.body.bootcamp = bootcampId;

  // Check if bootcamp is exit with specific id
  const bootcamp = await BootCamp.findById(bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp is found with id: ${id}`, 404));
  }

  //Check User is owner of Bootcamp under which course is being created
  const isOwner = checkForOwner(user, bootcamp);
  if (!isOwner) {
    return next(
      new ErrorResponse(
        `You not allow to add course under bootcamp id ${bootcampId}`,
        401
      )
    );
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
  const { user } = req;
  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course is found with id: ${id}`, 404));
  }

  //Check User is owner of Course
  const isOwner = checkForOwner(user, course);
  if (!isOwner) {
    return next(
      new ErrorResponse(
        `You are not authorized to update the course ${id}`,
        401
      )
    );
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
  const { user } = req;
  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse(`No course is found with id: ${id}`, 404));
  }

  //Check User is owner of Course
  const isOwner = checkForOwner(user, course);
  if (!isOwner) {
    return next(
      new ErrorResponse(
        `You are not authorized to Delete this course ${id}`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
