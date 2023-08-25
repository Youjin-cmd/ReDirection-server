const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const analysisController = require("../controllers/analysis.controller");
const cropController = require("../controllers/crop.controller");
const editController = require("../controllers/edit.controller");
const cleanupController = require("../controllers/cleanup.controller");

const { tryCatch } = require("../util/tryCatch");
const { multerErrorHandler } = require("../util/multerErrorHandler");

router.put("/clean", cleanupController.cleanup);

router.post(
  "/analysis",
  upload.single("video"),
  multerErrorHandler,
  tryCatch(analysisController.analyzeVideo),
);

router.post("/crop", tryCatch(cropController.cropVideo));

router.post("/edit", tryCatch(editController.editVideo));

module.exports = router;
