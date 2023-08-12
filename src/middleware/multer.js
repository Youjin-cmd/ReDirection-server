const multer = require("multer");
const fs = require("fs");
const path = require("path");

const SAVING_DIR = path.join(__dirname, "../../video");

try {
  fs.readdirSync(SAVING_DIR);
} catch (error) {
  console.error("Directory doesn't exist. Creating...");
  fs.mkdirSync(SAVING_DIR);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, SAVING_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

module.exports = upload;
