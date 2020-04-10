const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geoCoder");

/**
 * getBootcamps
 * * @desc    Get all Bootcamps list
 * * @route   GET /api/v1/bootcamps
 * * @access  Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query = null;

  //copy query parameters
  let reqQuery = { ...req.query };

  // remove fields
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((field) => delete reqQuery[field]);

  // create query string
  let queryString = JSON.stringify(reqQuery);

  // create operators like ($gt, $gte, $lt,$lte)
  queryString = queryString.replace(/\b(lt|lte|gte|gt|in)\b/g, (matched) => {
    return `$${matched}`;
  });

  // finding resources and populate fields of courses
  query = Bootcamp.find(JSON.parse(queryString)).populate("courses");

  //Create sort query
  if (req.query.sort) {
    const field = req.query.sort.split(",").join(" ");
    query = query.sort(field);
  }

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // For creating Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const starIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(starIndex).limit(limit);

  // Executing Query
  const bootcamps = await query;

  // Pagination prev and next object
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (starIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    pagination,
  });
});

/**
 * getBootcamp
 * * @desc    Get single Bootcamps
 * * @route   GET /api/v1/bootcamps/:id
 * * @access  Public
 * @param id
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp is not found with specified id: ${id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * createBootcamp
 * * @desc    Create new bootcamp
 * * @route   POST /api/v1/bootcamps
 * * @access  Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * updateBootcamp
 * * @desc    Update new bootcamp
 * * @route   PUT /api/v1/bootcamps/:id
 * * @access  Private
 * @param id
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * deleteBootcamp
 * * @desc    Delete new bootcamp
 * * @route   POST /api/v1/bootcamps/:id
 * * @access  Private
 * @param id
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //const bootcamp = await Bootcamp.findByIdAndDelete(id); // remove pre middleware is not going to run for findByIdAndDelete
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * getBootcampsInRadius
 * * @desc    get bootcamps within radius
 * * @route   GET /api/v1/bootcamps/:zipcode/:distance
 * * @access  Private
 * @param zipcode, distance
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  /* 
    Calculate radius using Radians
    Divide distance by Earth's radius
    i.e Earth radius 3,963 Mi and 6,378 km
  */
  const Radians = 6378;
  const radius = distance / Radians;

  // get bootcamps based on radius calculated
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
