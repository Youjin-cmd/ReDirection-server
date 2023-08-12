const CreateError = require("http-errors");
const { VIDEO_TOO_LARGE } = require("../constants/error");

const sizeLimitErrorHandler = (error, req, res, next) => {
  if (error) {
    throw CreateError(413, VIDEO_TOO_LARGE);
  } else {
    next();
  }
};

module.exports = sizeLimitErrorHandler;
