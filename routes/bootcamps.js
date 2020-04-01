const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
} = require("../controllers/bootcamps");
const router = express.Router();

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
/*
 always create same route name for all methods of that particular route
 like. /api/v1/bootcamps  Method supported GET, POST, PUT/PATCH , DELETE 
 */
// router.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `Showing list of all Bootcamps`
//   });
// });
// router.get("/:id", (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `Show bootcamp ${req.params.id}`
//   });
// });

// router.post("", (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `New Bootcamp is created`
//   });
// });

// router.put("/:id", (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `Update Bootcamp ${req.params.id}`
//   });
// });

// router.delete("/:id", (req, res) => {
//   res.status(200).json({
//     success: true,
//     msg: `Delete Bootcamp ${req.params.id}}`
//   });
// });

module.exports = router;
