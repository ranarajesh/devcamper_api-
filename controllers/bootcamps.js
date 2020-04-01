/**  
* getBootcamps 
* * @desc    Get all Bootcamps list
* * @route   GET /api/v1/bootcamps
* * @access  Public
* ? Can use as public API? 
* ! Deprecated 
* TODO refector it
* @param 

*/
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Showing list of all Bootcamps`
  });
};

/**  
* getBootcamp
* * @desc    Get single Bootcamps
* * @route   GET /api/v1/bootcamps/:id
* * @access  Public
* ? Can use as public API? Yes
* ! Deprecated 
* TODO refector it
* @param id 

*/
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show bootcamp ${req.params.id}`
  });
};

/**  
* createBootcamp
* * @desc    Create new bootcamp
* * @route   POST /api/v1/bootcamps
* * @access  Private
* ? Can use as public API?  NO
* ! Deprecated 
* TODO refector it
* @param 

*/
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `New Bootcamp is created!!`
  });
};

/**  
* updateBootcamp
* * @desc    Update new bootcamp
* * @route   PUT /api/v1/bootcamps/:id
* * @access  Private
* ? Can use as public API?  NO
* ! Deprecated 
* TODO refector it
* @param id

*/
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update Bootcamp ${req.params.id}`
  });
};

/**
 * deleteBootcamp
 * * @desc    Delete new bootcamp
 * * @route   POST /api/v1/bootcamps/:id
 * * @access  Private
 * ? Can use as public API?  NO
 * ! Deprecated
 * TODO refector it
 * @param id
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete Bootcamp ${req.params.id}}`
  });
};
