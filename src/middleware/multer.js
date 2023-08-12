const CreateError = require("http-errors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { ONLY_MP4_ALLOWED } = require("../constants/error");
const SAVING_DIR = path.join(__dirname, "../../video");

try {
  fs.readdirSync(SAVING_DIR);
} catch (error) {
  console.error("Directory doesn't exist. Creating...");
  fs.mkdirSync(SAVING_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, SAVING_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    if (ext !== ".mp4") {
      return cb(new CreateError(400, ONLY_MP4_ALLOWED));
    }

    cb(null, true);
  },
});

module.exports = upload;
