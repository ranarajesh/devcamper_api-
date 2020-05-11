const advanceResults = (model, populate) => async (req, res, next) => {
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

  //Finding resources
  query = model.find(JSON.parse(queryString));
  //Create sort query
  if (req.query.sort) {
    const field = req.query.sort.split(",").join(" ");
    query = query.sort(field);
  } else {
    query = query.sort("-createdAt");
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
  const total = await model.countDocuments();

  query = query.skip(starIndex).limit(limit);

  // check for populate
  if (populate) {
    query = query.populate(populate);
  }
  // Executing Query
  //const results = await query;

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

  // res.advanceResults = {
  //   success: true,
  //   count: results.length,
  //   pagination,
  //   data: results,
  // };
  res.advanceResults = {
    advanceQuery: query,
    pagination,
    docCount: total,
  };
  next();
};

module.exports = advanceResults;
