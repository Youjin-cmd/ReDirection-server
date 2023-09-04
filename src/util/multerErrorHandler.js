const CreateError = require("http-errors");
const {
  EXTENTION_NOT_SUPPORTED,
  VIDEO_TOO_LARGE,
} = require("../constants/error");

exports.multerErrorHandler = (error, req, res, next) => {
  if (error.message === "Only .mp4, .mov, .wmv, .avi are allowed") {
    throw CreateError(415, EXTENTION_NOT_SUPPORTED);
  }

  if (error.message === "File too large") {
    throw CreateError(413, VIDEO_TOO_LARGE);
  }

  next();
};
