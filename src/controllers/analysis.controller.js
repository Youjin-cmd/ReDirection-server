const CreateError = require("http-errors");
const fs = require("fs").promises;

const { UPLOAD_FAILED } = require("../constants/error");
const {
  SAVING_DIR_VIDEO,
  SAVING_DIR_BLEND_FRAMES,
  SAVING_DIR_DOWNSCALED_FRAMES,
} = require("../constants/paths");

const {
  extractDownscaledFrames,
} = require("../service/extractDownscaledFrames");
const { extractAudio } = require("../service/extractAudio");
const { createBlendFrames } = require("../service/createBlendFrames");
const { analyzePixelData } = require("../service/analyzePixelData");
const { reassembleFrames } = require("../service/reassembleFrames");
const { uploadToS3 } = require("../service/uploadToS3");
const { getMetaData } = require("../service/getMetaData");

exports.analyzeVideo = async (req, res) => {
  if (!req.file) {
    throw CreateError(400, UPLOAD_FAILED);
  }

  try {
    const videoWidth = await getMetaData(req.file);
    await extractDownscaledFrames(req.file);
    await extractAudio(req.file);
    await createBlendFrames();
    const result = await analyzePixelData();
    const assembledFile = await reassembleFrames(result.targetFolder);
    const analysisVideoUrl = await uploadToS3(assembledFile, "analysis");

    await fs.rm(SAVING_DIR_BLEND_FRAMES, { recursive: true });
    await fs.rm(SAVING_DIR_DOWNSCALED_FRAMES, { recursive: true });

    res.send({
      success: true,
      url: analysisVideoUrl,
      startPixelArray: result.startPixelArray,
      videoWidth,
    });
  } catch (error) {
    await fs.rm(SAVING_DIR_VIDEO, { recursive: true });
    throw new CreateError(error.status, error.message);
  }
};
