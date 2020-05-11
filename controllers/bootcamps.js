const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const { checkForOwner } = require("../utils/controllers");
const geocoder = require("../utils/geoCoder");

/**
 * * getBootcamps
 * * @desc    Get all Bootcamps list
 * * @route   GET /api/v1/bootcamps
 * * @access  Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await res.advanceResults.advanceQuery;
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
    pagination: res.advanceResults.pagination,
  });
});

/**
 * *  getBootcamp
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
 * * createBootcamp
 * * @desc    Create new bootcamp
 * * @route   POST /api/v1/bootcamps
 * * @access  Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to body of Bootcamp
  const userId = req.user.id;
  const { role } = req.user;
  req.body.user = userId;

  //Check the published bootcamp if publisher already published bootcamp or not
  const publishedBootcamp = await Bootcamp.findOne({ user: userId });

  //Validate one publisher only allowed one bootcamp to create
  if (publishedBootcamp && role !== "admin") {
    return next(
      new ErrorResponse(
        `One bootcamp is already published, not allow to publish more than one`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * * updateBootcamp
 * * @desc    Update new bootcamp
 * * @route   PUT /api/v1/bootcamps/:id
 * * @access  Private
 * @param id
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  let bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  // Check for User is Bootcamp owner
  const isBootCampOwner = checkForOwner(user, bootcamp);
  if (!isBootCampOwner) {
    return next(
      new ErrorResponse(
        `You are not allowed to Update this bootcamp ${id}`,
        401
      )
    );
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * * deleteBootcamp
 * * @desc    Delete new bootcamp
 * * @route   POST /api/v1/bootcamps/:id
 * * @access  Private
 * @param id
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  //const bootcamp = await Bootcamp.findByIdAndDelete(id); // remove pre middleware is not going to run for findByIdAndDelete
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  // Check for User is Bootcamp owner
  const isBootCampOwner = checkForOwner(user, bootcamp);
  if (!isBootCampOwner) {
    return next(
      new ErrorResponse(
        `You are not allowed to Delete this bootcamp ${id}`,
        401
      )
    );
  }
  bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * * getBootcampsInRadius
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

/**
 * * @name    bootcampPhotoUpload
 * * @desc    Upload bootcamp photo
 * * @route   PUT /api/v1/bootcamps/:id/photo
 * * @access  Private
 * @param id
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  // Check for User is Bootcamp owner
  const isBootCampOwner = checkForOwner(user, bootcamp);
  if (!isBootCampOwner) {
    return next(
      new ErrorResponse(
        `You are not allowed to Upload photo this bootcamp ${id}`,
        401
      )
    );
  }

  //Check is file available
  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload file for bootcamp id ${id}`, 400)
    );
  }

  const { file } = req.files;

  // Make sure request file is image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`कृपया मान्य छवि फ़ाइल जोड़ें`, 404));
  }
  // Check for file size
  if (file.size > process.env.BOOTCAMP_PHOTO_SIZE_LIMIT) {
    return next(
      new ErrorResponse(
        `File size should not be more than ${process.env.BOOTCAMP_PHOTO_SIZE_LIMIT}`,
        404
      )
    );
  }

  //Create custom file name
  file.name = `photo_bootcamp_${bootcamp.id}${path.parse(file.name).ext}`;

  const filePath = `${process.env.BOOTCAMP_PHOTO_UPLOAD_PATH}${file.name}`;
  //Move file to specified location
  file.mv(filePath, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    // Else update photo path of bootcamp
    await Bootcamp.findByIdAndUpdate(id, {
      photo: `/photos/${file.name}`,
    });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
