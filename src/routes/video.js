const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const analysisController = require("../controllers/analysis.controller");

const { tryCatch } = require("../utils/tryCatch");
const multerErrorHandler = require("../utils/multerErrorHandler");

router.post(
  "/analysis",
  upload.single("video"),
  multerErrorHandler,
  tryCatch(analysisController.analyzeVideo),
);

module.exports = router;
