const CreateError = require("http-errors");
const multer = require("multer");
const path = require("path");
const ensureFolderExists = require("../utils/ensureFolderExists");

const { ONLY_MP4_MOV_ALLOWED } = require("../constants/error");
const SAVING_DIR = path.join(__dirname, "../../video");

ensureFolderExists(SAVING_DIR);

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

    if (ext !== ".mp4" && ext !== ".mov") {
      return cb(new CreateError(415, ONLY_MP4_MOV_ALLOWED));
    }

    cb(null, true);
  },
});

module.exports = upload;
