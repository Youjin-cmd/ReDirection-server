const CreateError = require("http-errors");

const { UPLOAD_FAILED } = require("../constants/error");

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

    res.send({
      success: true,
      url: analysisVideoUrl,
      startPixelArray: result.startPixelArray,
      videoWidth,
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    return { success: false, error };
  }
};
