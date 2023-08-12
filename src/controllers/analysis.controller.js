const CreateError = require("http-errors");

const { UPLOAD_FAILED } = require("../constants/error");

exports.analyzeVideo = async (req, res) => {
  if (!req.file) {
    throw CreateError(400, UPLOAD_FAILED);
  }

  return res.send({ success: true });
};
