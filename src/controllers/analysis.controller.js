const { UPLOAD_FAILED } = require("../constants/error");
const createError = require("http-errors");

exports.analyzeVideo = async (req, res) => {
  if (!req.file) {
    throw createError(400, UPLOAD_FAILED);
  }

  return res.send({ success: true });
};
