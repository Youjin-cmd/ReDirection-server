const CreateError = require("http-errors");
const multer = require("multer");

const { ONLY_MP4_MOV_ALLOWED } = require("../constants/error");
const path = require("path");

const { ensureFolderExists } = require("../util/ensureFolderExists");

const { SAVING_DIR_VIDEO } = require("../constants/paths");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureFolderExists(SAVING_DIR_VIDEO);
    cb(null, SAVING_DIR_VIDEO);
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
