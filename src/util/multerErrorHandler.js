const CreateError = require("http-errors");
const { ONLY_MP4_MOV_ALLOWED, VIDEO_TOO_LARGE } = require("../constants/error");

exports.multerErrorHandler = (error, req, res, next) => {
  if (error.message === "Only mp4 and mov are allowed") {
    throw CreateError(415, ONLY_MP4_MOV_ALLOWED);
  }

  if (error.message === "File too large") {
    throw CreateError(413, VIDEO_TOO_LARGE);
  }

  next();
};
