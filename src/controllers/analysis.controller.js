const CreateError = require("http-errors");
const { UPLOAD_FAILED } = require("../constants/error");

const { extractDownscaledFrames } = require("../utils/extractDownscaledFrames");
const { extractAudio } = require("../utils/extractAudio");

exports.analyzeVideo = async (req, res) => {
  if (!req.file) {
    throw CreateError(400, UPLOAD_FAILED);
  }

  try {
    await extractDownscaledFrames(req);
    await extractAudio(req);
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error };
  }
};
