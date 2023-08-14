const CreateError = require("http-errors");

const { UPLOAD_FAILED } = require("../constants/error");
const {
  extractDownscaledFrames,
} = require("../service/extractDownscaledFrames");
const { extractAudio } = require("../service/extractAudio");
const { createBlendFrames } = require("../service/createBlendFrames");

exports.analyzeVideo = async (req, res) => {
  if (!req.file) {
    throw CreateError(400, UPLOAD_FAILED);
  }

  try {
    await extractDownscaledFrames(req);
    await extractAudio(req);
    await createBlendFrames();
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error };
  }
};
